import React, { useState, useEffect } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { Button, Spinner } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useLocation, Link } from 'wouter'
import { Player } from './types'
import { PLAYERS_URL, LIMIT, SORT } from './constants'
import { toast } from 'react-toastify'
import withQuery from 'with-query'
import { Paginator, SkeletonGenerator } from '../../utils'

const List: React.FC<{ page: number }> = ({ page }) => {
  const [, setLocation] = useLocation()
  const [players, setPlayers] = useState<Player[]>([])
  const [removing, setRemoving] = useState<string[]>([])
  const [totalPages, setTotalPages] = useState(page)

  useEffect(() => {
    if (isNaN(page)) {
      setLocation(`/list/1`)
    } else {
      setPlayers([])
      Promise.all([
        fetch(
          withQuery(PLAYERS_URL, {
            limit: LIMIT,
            page,
            sort: SORT,
          })
        ),
        fetch(
          withQuery(PLAYERS_URL, {
            join: 'club',
          })
        ),
      ])
        .then(([r1, r2]) => {
          if (!r1 || !r2) throw new Error('Ошибка загрузки данных!')
          return Promise.all([r1.json(), r2.json()])
        })
        .then(([all, withClub]) => {
          all.data.forEach((item: Player, idx: number, items: Player[]) => {
            let found = withClub.find((player: Player) => player.id === item.id)
            if (found) items[idx] = found
          })
          setPlayers(all.data)
          setTotalPages(all.pageCount)
          if (all.pageCount < page) setLocation(`/list/${all.pageCount}`)
        })
        .catch(e => {
          toast.error(e.message)
        })
    }
  }, [page, setLocation])

  const remove = (id: string) => {
    setRemoving(prev => prev.concat([id]))
    fetch(`${PLAYERS_URL}/${id}`, { method: 'delete' })
      .then(r => {
        if (!r.ok) throw new Error('Ошибка удаления!')
        fetch(
          withQuery(PLAYERS_URL, {
            limit: LIMIT,
            page,
            sort: SORT,
          })
        )
          .then(r2 => {
            if (!r2.ok) throw new Error('Ошибка загрузки!')
            return r2.json()
          })
          .then(response => {
            if (response.pageCount < page) setLocation(`/${response.pageCount}`)
            setPlayers(response.data)
            toast.success('Игрок удален!')
          })
      })
      .catch(e => {
        setRemoving(prev => prev.filter(item => item !== id))
        toast.error(e.message)
      })
  }

  return (
    <>
      <Button
        className="align-self-end"
        style={{ marginBottom: 15 }}
        onClick={() => setLocation('/create')}
      >
        Создать
      </Button>
      <Table>
        <Thead>
          <Tr>
            <Th>Фамилия</Th>
            <Th>Имя</Th>
            <Th>Адрес</Th>
            <Th>Телефон</Th>
            <Th>Email</Th>
            <Th>Ранг</Th>
            <Th>Клуб</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {players.length > 0 ? (
            players.map(player => (
              <Tr key={player.id}>
                <Td style={{ paddingBottom: 30 }}>
                  <Link href={`/${player.id}/show`}>{player.lastName}</Link>
                </Td>
                <Td style={{ paddingBottom: 30 }}>{player.firstName}</Td>
                <Td style={{ paddingBottom: 30 }}>{player.address}</Td>
                <Td style={{ paddingBottom: 30 }}>{player.tel}</Td>
                <Td style={{ paddingBottom: 30 }}>{player.email}</Td>
                <Td style={{ paddingBottom: 30 }}>{player.rank}</Td>
                <Td style={{ paddingBottom: 30 }}>
                  {player.club
                    ? player.club.name.length > 20
                      ? player.club.name.slice(0, 20) + '...'
                      : player.club.name
                    : '-----'}
                </Td>
                <Td align="right" style={{ paddingBottom: 30 }}>
                  <Button
                    className="d-inline-flex justify-content-center"
                    style={{ height: 40, marginRight: 5 }}
                    color="primary"
                    onClick={() => setLocation(`/${player.id}/edit`)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    className="d-inline-flex justify-content-center"
                    style={{ height: 40 }}
                    color="danger"
                    onClick={() => remove(player.id)}
                    disabled={removing.includes(player.id)}
                  >
                    {removing.includes(player.id) ? (
                      <Spinner
                        color="light"
                        style={{ width: 14, height: 14 }}
                      />
                    ) : (
                      <FontAwesomeIcon icon={faTrash} />
                    )}
                  </Button>
                </Td>
              </Tr>
            ))
          ) : (
            <SkeletonGenerator x={7} y={5} h={65} />
          )}
        </Tbody>
      </Table>
      <Paginator page={page} totalPages={totalPages} />
    </>
  )
}

export default List
