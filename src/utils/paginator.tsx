import React from 'react'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'
import { Link } from 'wouter'
import { toast } from 'react-toastify'

type paginatorProps = {
  page: number
  totalPages: number
}

const Paginator: React.FC<paginatorProps> = ({ page, totalPages }) => {
  return (
    <Pagination aria-label="navigation" style={{ marginTop: 15 }}>
      <PaginationItem>
        <PaginationLink
          onClick={() => page === 1 && toast.info('Уже в начале')}
          first
          tag={Link}
          href="/list/1"
        />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink
          onClick={() => page === 1 && toast.info('Ничего нет')}
          previous
          tag={Link}
          href={`/list/${page > 1 ? page - 1 : 1}`}
        />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink
          next
          tag={Link}
          href={`/list/${page === totalPages ? page : page + 1}`}
          onClick={() => page === totalPages && toast.info('Ничего нет')}
        />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink
          last
          tag={Link}
          href={`/list/${totalPages}`}
          onClick={() => page === totalPages && toast.info('Уже в конце')}
        />
      </PaginationItem>
    </Pagination>
  )
}

export default Paginator
