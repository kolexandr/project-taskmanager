'use client'

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  
  
  return( 
    <div className="text-black flex-col wd-full min-h-screen p-24 align-center justify-center">
      <center>
        <h1 className='font-bold flex-col text-4xl'>Welcome to the <span className='text-orange-400'>Task Manager</span> created by <span className='text-blue-950'>Oleksandr Koniukh!</span></h1>
        <p className='mt-4 font-light'>To get started, please navigate to the "Create Task" page using the sidebar on the left. There, you can add new tasks to your task list.</p>
        <p className='mt-4 font-light'>Once you've added some tasks, head over to the "View Tasks" page to see your list of tasks. You can mark tasks as completed or delete them as needed.</p>
        <div className='mt-6'>
          <span className='font-medium'>Happy task managing!)</span>
        </div>
      </center>
    </div>
  )
}