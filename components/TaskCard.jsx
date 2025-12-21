import React from 'react'

import { useState } from 'react';
import {useSession} from 'next-auth/react';
import {usePathname, useRouter} from 'next/navigation';

const TaskCard = ({task, handleEdit, handleDelete}) => {
  const {data: session} = useSession();
  const pathName = usePathname();
  const router = useRouter();
  
  return (
    <div className=' border border-gray-300 mb-5 pb-5 text-sm flex flex-col justify-between rounded-lg gap-5 hover:shadow-lg transition-shadow duration-300 ease-in-out p-5 bg-white'>
      <p>{task.text}</p>

      {session?.user.id === task.creator._id && (
        <div className='mt-1 flex justify-center gap-4'>
          <p className='text-sm cursor-pointer text-green-400' onClick={handleEdit}>
            Edit
          </p>
          <p className='text-sm cursor-pointer text-orange-400' onClick={handleDelete}>
            Delete
          </p>
        </div>
      )}
    </div>
  )
}



export default TaskCard;
