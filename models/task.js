import { Schema, model, models } from "mongoose";

const TaskSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  untilDate: {
    type: Date,
    required: [true, "Due date is required"],
  },
  description: {
    type: String
  }
}, { timestamps: true });

TaskSchema.index({ creator: 1 });

const Task = models.Task || model('Task', TaskSchema);

export default Task;
