'use client';

import { useEffect, useState} from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Form from '@components/Form';

const EditTaskClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get('id');
  
  const [submitting, setSubmitting] = useState(false);
  const [task, setTask] = useState({
    text: '',
    completed: false
  });

  useEffect(() => {
    const getTaskDetails = async () => {
      const response = await fetch(`/api/tasks/${taskId}`);
      const data = await response.json();

      setTask({
        text: data.text,
        completed: data.completed
      });
    }

    if (taskId) getTaskDetails();
  }, [taskId])
  
  const updateTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!taskId) return alert("Missing taskId!");

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: task.text,
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
  <main className="min-h-screen flex flex-col justify-between">
    <div className="text-black flex min-h-screen flex-col p-24">
      <h1 className="text-3xl font-bold">Task manager</h1>
      <Form 
        type="Edit"
        task ={task}
        setTask={setTask}
        submitting={submitting}
        handleSubmit={updateTask}
      />
    </div>

  </main>
  )
}

export default EditTaskClient;