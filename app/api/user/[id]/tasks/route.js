import {connectToDatabase} from '@utils/database';
import Task from '@models/task';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const tasks = await Task
      .find({ creator: id })
      .populate('creator');

    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch tasks", { status: 500 });
  }
}
