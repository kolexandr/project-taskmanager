import {connectToDatabase} from '@utils/database';
import Task from '@models/task';

export const POST = async (req) => {
  const { userId, title, description, untilDate, priority } = await req.json();
  try {
    await connectToDatabase();
    const newTask = new Task({
      creator: userId,
      title,
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