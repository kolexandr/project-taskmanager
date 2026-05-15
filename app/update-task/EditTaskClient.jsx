'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const EditTaskClient = () => {

  const {data:session} = useSession();
  if (!session){
    redirect("/");
  }

  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get('id');

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    untilDate: '',
    priority: 'medium',
    completed: false
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const getTaskDetails = async () => {
      try {
        const response = await fetch(`/api/tasks/${taskId}`);
        if (!response.ok) throw new Error('Failed to load task');

        const data = await response.json();

        setForm({
          title: data.title || '',
          description: data.description || '',
          untilDate: data.untilDate ? new Date(data.untilDate).toISOString().split('T')[0] : '',
          priority: data.priority || 'medium',
          completed: Boolean(data.completed),
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load task details');
      }
    };

    if (taskId) getTaskDetails();
  }, [taskId]);

  const updateTask = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) return setError('Title is required');
    if (!form.untilDate) return setError('Due date is required');
    setSubmitting(true);

    if (!taskId) {
      setSubmitting(false);
      return setError('Missing task ID');
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          untilDate: form.untilDate,
          priority: form.priority,
          completed: form.completed,
        })
      });

      if (response.ok) {
        setMessage('Task updated successfully.');
        setTimeout(() => router.push('/view-tasks'), 1000);
      } else {
        const text = await response.text();
        setError(text || 'Failed to update task');
      }
    } catch (err) {
      console.error(err);
      setError('Network error updating task');
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-8">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Edit Task</h1>

        {message && (
          <div className="mb-4 text-green-800 bg-green-100 px-4 py-2 rounded">{message}</div>
        )}
        {error && (
          <div className="mb-4 text-red-800 bg-red-100 px-4 py-2 rounded">{error}</div>
        )}

        <form onSubmit={updateTask} className="flex flex-col gap-4">
          <label className="flex flex-col">
            <span className="font-semibold text-sm text-gray-700">Title</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Task title"
              required
              className="mt-1 px-3 py-2 border rounded-md bg-gray-50"
            />
          </label>

          <label className="flex flex-col">
            <span className="font-semibold text-sm text-gray-700">Description (optional)</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Add more details about the task"
              rows={4}
              className="mt-1 px-3 py-2 border rounded-md bg-gray-50 resize-none"
            />
          </label>

          <div className="flex gap-4">
            <label className="flex flex-col flex-1">
              <span className="font-semibold text-sm text-gray-700">Due date</span>
              <input
                type="date"
                value={form.untilDate}
                onChange={(e) => setForm({ ...form, untilDate: e.target.value })}
                required
                className="mt-1 px-3 py-2 border rounded-md bg-gray-50"
              />
            </label>

            <label className="flex flex-col w-48">
              <span className="font-semibold text-sm text-gray-700">Priority</span>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="mt-1 px-3 py-2 border rounded-md bg-gray-50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.completed}
              onChange={(e) => setForm({ ...form, completed: e.target.checked })}
            />
            <span className="font-semibold text-sm text-gray-700">Completed</span>
          </label>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => router.push('/view-tasks')}
              className="px-4 py-2 bg-gray-200 rounded text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-orange-500 text-white rounded text-sm disabled:opacity-60"
            >
              {submitting ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditTaskClient;
