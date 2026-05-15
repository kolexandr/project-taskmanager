import {connectToDatabase} from '@utils/database';
import Task from '@models/task';

export const POST = async (req) => {
  const { userId, title, description, untilDate, priority } = await req.json();
  try {
    await connectToDatabase();

    const normalizedTitle = title?.trim();

    if (!userId || !normalizedTitle || !untilDate) {
      return new Response('Missing required fields', { status: 400 });
    }

    const existingTask = await Task.findOne({
      creator: userId,
      title: normalizedTitle,
    });

    if (existingTask) {
      return new Response('Task with this title already exists', { status: 409 });
    }

    const newTask = new Task({
      creator: userId,
      title: normalizedTitle,
      description: description || '',
      untilDate: untilDate ? new Date(untilDate) : undefined,
      priority: priority || 'medium',
      completed: false,
    });

    await newTask.save();
    return new Response(JSON.stringify(newTask), { status: 201 });

  } catch (error) {
    console.error('Failed to create a new task', error);
    return new Response('Failed to create a new task', { status: 500 });
  }
}
