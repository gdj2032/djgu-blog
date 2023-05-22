import React from 'react'
import { usePagination } from '@djgu/react-comps'
import './index.scss';
import { userService } from '@/services';

const Home = () => {

  const { tableProps } = usePagination(async ({ limit, offset }) => {
    const res = await userService.users({ limit, offset })
    return {
      dataSource: res.data.data,
      total: res.data.data
    }
  })

  console.info('--- tableProps --->', tableProps);

  return (
    <div className="g-home">
      home
    </div>
  )
}

export default Home
