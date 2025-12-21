import {connectToDatabase} from '@utils/database';
import Task from '@models/task';

export const GET = async (req) => {
  try {
    await connectToDatabase();

    const tasks = await Task.find({}).populate('creator');

    return new Response(JSON.stringify(tasks), {status: 200});
  } catch (error) {
    return new Response("Failed to fetch tasks", {status: 500});
  }
}