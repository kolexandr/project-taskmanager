'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


const CreateTask = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [form, setForm] = useState({
    title: '',
    description: '',
    untilDate: '',
    priority: 'medium',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const createTask = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) return setError('Title is required');
    if (!form.untilDate) return setError('Due date is required');

    setSubmitting(true);

    try {
      const res = await fetch('/api/tasks/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          title: form.title,
          description: form.description,
          untilDate: form.untilDate,
          priority: form.priority,
        }),
      });

      if (res.ok) {
        setMessage('Task created successfully.');
        setForm({ title: '', description: '', untilDate: '', priority: 'medium' });
        // optional: navigate to tasks list after short delay
        setTimeout(() => router.push('/view-tasks'), 1000);
      } else {
        const text = await res.text();
        setError(text || 'Failed to create task');
      }
    } catch (err) {
      console.error(err);
      setError('Network error creating task');
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-8">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Create Task</h1>

        {message && (
          <div className="mb-4 text-green-800 bg-green-100 px-4 py-2 rounded">{message}</div>
        )}
        {error && (
          <div className="mb-4 text-red-800 bg-red-100 px-4 py-2 rounded">{error}</div>
        )}

        <form onSubmit={createTask} className="flex flex-col gap-4">
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

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-200 rounded text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-orange-500 text-white rounded text-sm disabled:opacity-60"
            >
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateTask;