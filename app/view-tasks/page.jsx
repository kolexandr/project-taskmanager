'use client';

import {useState, useEffect} from 'react'
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';

import TaskCard from '@components/TaskCard';


const page = () => {
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResult, setSearchedResult]= useState([]);

  const [tasks, setTasks] = useState([]);

  const {data: session} = useSession();


  const filterText = (searchText) => {
    const regex = new RegExp(searchText, 'i');
    return tasks.filter((task) => regex.test(task.text));
  }

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResults = filterText(e.target.value);
        setSearchedResult(searchResults);
      }, 500)
    );
  }

  useEffect(() => {
    const fetchTasks = async () => {
      if (!session?.user.id) return;

      const response = await fetch(`/api/user/${session.user.id}/tasks`);
      const data = await response.json();

      setTasks(data);
    }

    if (session?.user.id) fetchTasks();
  }, [session?.user.id]);

  const TaskCardList = ({data}) => {

  const router = useRouter();

  const handleEdit = async (task) => {
    router.push(`/update-task?id=${task._id}`);
  }

  const handleDelete = async (taskToDelete) => {
    const hasConfirmed = confirm("Are you sure you want to delete this task?");

    if (!hasConfirmed) return;

    try {
      const res = await fetch(`/api/tasks/${taskToDelete._id.toString()}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete task');

      const filteredTasks = data.filter((t) => t._id !== taskToDelete._id);

      setTasks(filteredTasks);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='mt-16'>
      {data.map((item) => (
        <TaskCard 
          key={item._id}
          task={item}
          handleEdit={() => handleEdit && handleEdit(item)}
          handleDelete={() => handleDelete && handleDelete(item)}
        />
      ))}
    </div>
  )
}

return (
  <section className='bg-amber-100 w-full text-center flex-col'>
    <form className="bg-amber-100 w-full text-center flex-col">
      <input type="text"
        placeholder="Search tasks..."
        value={searchText}
        onChange={handleSearchChange}
        required
        className='font-medium bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-base text-gray-700 px-5 py-3 resize-none block w-full mt-7'
      />
    </form>
    <TaskCardList
      data={searchText ? searchedResult : tasks}
    />
  </section>
)
}

export default page
