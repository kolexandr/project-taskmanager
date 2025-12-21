'use client';

import { useState } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Form from '@components/Form';


const CreateTask = () => {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [submitting, setSubmitting] = useState(false);
  const [task, setTask] = useState({
    text: '',
    completed: false
  });
  
  const createTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/tasks/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: task.text,
          userId: session?.user.id,
          completed: task.completed
        })
      })
      
      if (response.ok){
        router.push('/view-tasks');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  }
  
  return( 
  <main className=" min-h-screen flex flex-col justify-between">
    <div className="text-black flex min-h-screen flex-col p-24">
      <h1 className="text-3xl font-bold">Task manager</h1>
      <Form 
        type="Create"
        task ={task}
        setTask={setTask}
        submitting={submitting}
        handleSubmit={createTask}
      />
    </div>
    {/* <footer className="fixed bottom-0 left-0 w-full text-center py-4  z-40">
        <a href="https://github.com/kolexandr" target="_blank" rel="noopener noreferrer">
          Come to my <b>GitHub</b>
        </a>
        <br />
        <a href="https://www.linkedin.com/in/oleksandr-koniukh-a58158323/" target="_blank" rel="noopener noreferrer">Or to my <b>Linkedln</b></a>
    </footer> */}

  </main>
  )
}
export default CreateTask;