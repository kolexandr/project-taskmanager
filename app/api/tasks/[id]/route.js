import {connectToDatabase} from '@utils/database';
import Task from '@models/task';

export const GET = async (req, {params}) => {
  try {
    await connectToDatabase();

    const { id } = await params;

    const task = await Task.findById(id).populate('creator');
    if(!task) return new Response("Task not found", {status: 404});

    return new Response(JSON.stringify(task), {status: 200});
  } catch (error) {
    return new Response("Failed to fetch tasks", {status: 500});
  }
}

export const PATCH = async (req, {params}) => {
  const {text, completed} = await req.json();

  try {
    await connectToDatabase();

    const { id } = await params;

    const existingTask = await Task.findById(id);
    if(!existingTask) return new Response("Task not found", {status: 404});

    existingTask.text = text;
    existingTask.completed = completed;

    await existingTask.save();

    return new Response(JSON.stringify(existingTask), {status: 200});
  } catch (error) {
    return new Response("Failed to update task", {status: 500});
  }
}

export const DELETE = async (req, {params}) => {
  try {
    await connectToDatabase();

    const { id } = await params;

    await Task.findByIdAndDelete(id);

    return new Response("Task deleted successfully", {status: 200});
  } catch (error) {
    return new Response("Failed to delete task", {status: 500});
  }
}