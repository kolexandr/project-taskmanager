import { Schema, model, models } from "mongoose"


const TaskSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: [true, 'Title is required'],
  },
  completed: {
    type: Boolean,
    default: false,
  }
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // }
});

const Task = models.Task || model('Task', TaskSchema);

export default Task;
