import {connectToDatabase} from '@utils/database';
import Task from '@models/task';

export const POST = async (req) => {
  const {userId, text, completed} = await req.json();
  try {
    await connectToDatabase();
    const newTask = new Task({
      creator: userId,
      text,
      completed : completed || false,
      // createdAt: createdAt || new Date(),
    });
  

    await newTask.save();
    return new Response(JSON.stringify(newTask), {status: 201});
  
    
  } catch (error) {
    return new Response("Failed to create a new task", {status: 500});
  }
}