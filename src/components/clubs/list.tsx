import React, { useState, useEffect } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { Button, Spinner } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useLocation } from 'wouter'
import { Club } from './types'
import { CLUBS_URL } from './constants'
import { toast } from 'react-toastify'
import withQuery from 'with-query'
import { Paginator, SkeletonGenerator } from '../../utils'

const List: React.FC<{ page: number }> = ({ page }) => {
  const [, setLocation] = useLocation()
  const [clubs, setClubs] = useState<Club[]>([])
  const [removing, setRemoving] = useState<string[]>([])
  const [totalPages, setTotalPages] = useState(page)

  const limit = 5
  const sort = 'id,DESC'

  useEffect(() => {
    if (isNaN(page)) {
      setLocation(`/list/1`)
    } else {
      setClubs([])
      fetch(
        withQuery(CLUBS_URL, {
          limit,
          page,
          sort,
        })
      )
        .then(r => {
          if (!r.ok) throw new Error('Ошибка загрузки данных!')
          return r.json()
        })
        .then(response => {
          setClubs(response.data)
          setTotalPages(response.pageCount)
          if (response.pageCount < page) setLocation(`/${response.pageCount}`)
        })
        .catch(e => {
          toast.error(e.message)
        })
    }
  }, [page, limit, setLocation])

  const remove = (id: string) => {
    setRemoving(prev => prev.concat([id]))
    fetch(`${CLUBS_URL}/${id}`, { method: 'delete' })
      .then(r => {
        if (!r.ok) throw new Error('Ошибка удаления!')
        fetch(
          withQuery(CLUBS_URL, {
            limit,
            page,
            sort,
          })
        )
          .then(r2 => {
            if (!r2.ok) throw new Error('Ошибка загрузки!')
            return r2.json()
          })
          .then(response => {
            if (response.pageCount < page) setLocation(`/${response.pageCount}`)
            setClubs(response.data)
            toast.success('Клуб удален!')
          })
      })
      .catch(e => {
        setRemoving(prev => prev.filter(item => item !== id))
        toast.error(e.message)
      })
  }

  return (
    <>
      <Button className="align-self-end" onClick={() => setLocation('/create')}>
        Создать
      </Button>
      <Table>
        <Thead>
          <Tr>
            <Th>Название</Th>
            <Th>Адрес</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {clubs.length > 0 ? (
            clubs.map(club => (
              <Tr key={club.id}>
                <Td style={{ paddingBottom: 30 }}>{club.name}</Td>
                <Td style={{ paddingBottom: 30 }}>{club.address}</Td>
                <Td align="right" style={{ paddingBottom: 30 }}>
                  <Button
                    className="d-inline-flex justify-content-center"
                    style={{ height: 40, marginRight: 5 }}
                    color="primary"
                    onClick={() => setLocation(`/${club.id}/edit`)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    className="d-inline-flex justify-content-center"
                    style={{ height: 40 }}
                    color="danger"
                    onClick={() => remove(club.id)}
                    disabled={removing.includes(club.id)}
                  >
                    {removing.includes(club.id) ? (
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
            <SkeletonGenerator x={2} y={5} h={65} />
          )}
        </Tbody>
      </Table>
      <Paginator page={page} totalPages={totalPages} />
    </>
  )
}

export default List
