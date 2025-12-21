import React, { Suspense } from 'react';
import EditTaskClient from './EditTaskClient';



const EditTask = () => {
  return (
    <Suspense fallback={<div className="text-black p-24">Loading...</div>}>
      <EditTaskClient />
    </Suspense>
  )
}

export default EditTask;