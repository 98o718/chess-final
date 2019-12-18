import React, { useState, useEffect } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { Button, Spinner } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useLocation } from 'wouter'
import { Tournament } from './types'
import { TOURNAMENTS_URL, LIMIT, SORT } from './constants'
import { toast } from 'react-toastify'
import withQuery from 'with-query'
import { Paginator, SkeletonGenerator } from '../../utils'
import dayjs from 'dayjs'

const List: React.FC<{ page: number }> = ({ page }) => {
  const [, setLocation] = useLocation()
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [removing, setRemoving] = useState<string[]>([])
  const [totalPages, setTotalPages] = useState(page)

  useEffect(() => {
    if (isNaN(page)) {
      setLocation(`/list/1`)
    } else {
      setTournaments([])
      fetch(
        withQuery(TOURNAMENTS_URL, {
          limit: LIMIT,
          page,
          sort: SORT,
        })
      )
        .then(r => {
          if (!r.ok) throw new Error('Ошибка загрузки данных!')
          return r.json()
        })
        .then(response => {
          setTournaments(response.data)
          setTotalPages(response.pageCount)
          if (response.pageCount < page)
            setLocation(`/list/${response.pageCount}`)
        })
        .catch(e => {
          toast.error(e.message)
        })
    }
  }, [page, setLocation])

  const remove = (id: string) => {
    setRemoving(prev => prev.concat([id]))
    fetch(`${TOURNAMENTS_URL}/${id}`, { method: 'delete' })
      .then(r => {
        if (!r.ok) throw new Error('Ошибка удаления!')
        fetch(
          withQuery(TOURNAMENTS_URL, {
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
            setTournaments(response.data)
            toast.success('Турнир удален!')
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
            <Th>Название</Th>
            <Th>Начало</Th>
            <Th>Конец</Th>
            <Th>Организатор</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {tournaments.length > 0 ? (
            tournaments.map(tournament => (
              <Tr key={tournament.id}>
                <Td style={{ paddingBottom: 30 }}>{tournament.name}</Td>
                <Td style={{ paddingBottom: 30 }}>
                  {dayjs(tournament.begin).format('DD.MM.YYYY')}
                </Td>
                <Td style={{ paddingBottom: 30 }}>
                  {dayjs(tournament.end).format('DD.MM.YYYY')}
                </Td>
                <Td style={{ paddingBottom: 30 }}>
                  {tournament.organizer && tournament.organizer.name}
                </Td>
                <Td align="right" style={{ paddingBottom: 30 }}>
                  <Button
                    className="d-inline-flex justify-content-center"
                    style={{ height: 40, marginRight: 5 }}
                    color="primary"
                    onClick={() => setLocation(`/${tournament.id}/edit`)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    className="d-inline-flex justify-content-center"
                    style={{ height: 40 }}
                    color="danger"
                    onClick={() => remove(tournament.id)}
                    disabled={removing.includes(tournament.id)}
                  >
                    {removing.includes(tournament.id) ? (
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
            <SkeletonGenerator x={4} y={5} h={65} />
          )}
        </Tbody>
      </Table>
      <Paginator page={page} totalPages={totalPages} />
    </>
  )
}

export default List
