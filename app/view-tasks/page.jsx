'use client';

import {useState, useEffect} from 'react'
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';


const page = () => {

  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResult, setSearchedResult] = useState([]);
  const [tasks, setTasks] = useState([]);
  const { data: session } = useSession();

  // Search in title and description
  const filterText = (searchText) => {
    const regex = new RegExp(searchText, 'i');
    return tasks.filter((task) =>
      regex.test(task.title) || regex.test(task.description || '')
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);
    setSearchTimeout(
      setTimeout(() => {
        const searchResults = filterText(e.target.value);
        setSearchedResult(searchResults);
      }, 400)
    );
  };

  useEffect(() => {
    const fetchTasks = async () => {
      if (!session?.user.id) return;

      const response = await fetch(`/api/user/${session.user.id}/tasks`);
      const data = await response.json();

      setTasks(data);
    }

    if (session?.user.id) fetchTasks();
  }, [session?.user.id]);


  const router = useRouter();

  const handleEdit = (task) => {
    router.push(`/update-task?id=${task._id}`);
  };

  const handleDelete = async (taskToDelete) => {
    const hasConfirmed = confirm('Are you sure you want to delete this task?');
    if (!hasConfirmed) return;
    try {
      const res = await fetch(`/api/tasks/${taskToDelete._id.toString()}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id));
    } catch (error) {
      console.log(error);
    }
  };


  // Table columns: Title, Description, Priority, Due Date, Completed, Actions
  return (
    <section className="min-h-screen w-full flex flex-col items-center py-8">
      <form className="mb-6 w-full flex justify-center">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchText}
          onChange={handleSearchChange}
          className="font-medium bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-base text-gray-700 px-5 py-2 w-80"
        />
      </form>
      <div className="overflow-x-auto w-full max-w-5xl">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-orange-200 text-gray-700">
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Priority</th>
              <th className="py-2 px-4">Due Date</th>
              <th className="py-2 px-4">Completed</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(searchText ? searchedResult : tasks).map((task) => (
              <tr key={task._id} className="border-b hover:bg-orange-50">
                <td className="py-2 px-4 text-left font-semibold">{task.title}</td>
                <td className="py-2 px-4 text-left">{task.description || '-'}</td>
                <td className="py-2 px-4 text-center capitalize">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${task.priority === 'high' ? 'bg-red-200 text-red-800' : task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>{task.priority}</span>
                </td>
                <td className="py-2 px-4 text-center">{task.untilDate ? new Date(task.untilDate).toLocaleDateString() : '-'}</td>
                <td className="py-2 px-4 text-center">{task.completed ? 'Yes' : 'No'}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    className="text-green-600 hover:underline mr-3"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-orange-600 hover:underline"
                    onClick={() => handleDelete(task)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {(searchText ? searchedResult : tasks).length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-400">No tasks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default page
