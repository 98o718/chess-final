import React, { useState, useEffect } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { Button, Spinner } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useLocation } from 'wouter'
import { Organizer } from './types'
import { ORGANIZERS_URL, LIMIT, SORT } from './constants'
import { toast } from 'react-toastify'
import withQuery from 'with-query'
import { Paginator, SkeletonGenerator } from '../../utils'

const List: React.FC<{ page: number }> = ({ page }) => {
  const [, setLocation] = useLocation()
  const [organizers, setOrganizers] = useState<Organizer[]>([])
  const [removing, setRemoving] = useState<string[]>([])
  const [totalPages, setTotalPages] = useState(page)

  useEffect(() => {
    if (isNaN(page)) {
      setLocation(`/list/1`)
    } else {
      setOrganizers([])
      fetch(
        withQuery(ORGANIZERS_URL, {
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
          setOrganizers(response.data)
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
    fetch(`${ORGANIZERS_URL}/${id}`, { method: 'delete' })
      .then(r => {
        if (!r.ok) throw new Error('Ошибка удаления!')
        fetch(
          withQuery(ORGANIZERS_URL, {
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
            setOrganizers(response.data)
            toast.success('Организатор удален!')
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
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {organizers.length > 0 ? (
            organizers.map(organizer => (
              <Tr key={organizer.id}>
                <Td style={{ paddingBottom: 30 }}>{organizer.name}</Td>
                <Td align="right" style={{ paddingBottom: 30 }}>
                  <Button
                    className="d-inline-flex justify-content-center"
                    style={{ height: 40, marginRight: 5 }}
                    color="primary"
                    onClick={() => setLocation(`/${organizer.id}/edit`)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    className="d-inline-flex justify-content-center"
                    style={{ height: 40 }}
                    color="danger"
                    onClick={() => remove(organizer.id)}
                    disabled={removing.includes(organizer.id)}
                  >
                    {removing.includes(organizer.id) ? (
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
            <SkeletonGenerator x={1} y={5} h={65} />
          )}
        </Tbody>
      </Table>
      <Paginator page={page} totalPages={totalPages} />
    </>
  )
}

export default List
