import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { Tr, Td } from 'react-super-responsive-table'

type skeletonGeneratorProps = {
  x: number
  y: number
  h?: number
}

const SkeletonGenerator: React.FC<skeletonGeneratorProps> = ({ x, y, h }) => {
  const height = h ? h : 65
  const trs = new Array(y).fill(1)
  const tds = new Array(x).fill(1)
  return (
    <>
      {trs.map((tr, idx) => (
        <Tr key={idx}>
          {tds.map((td, idx) => (
            <Td key={idx}>
              <Skeleton height={height} />
            </Td>
          ))}
        </Tr>
      ))}
    </>
  )
}

export default SkeletonGenerator
