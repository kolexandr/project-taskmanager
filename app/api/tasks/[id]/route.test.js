import { PATCH, DELETE } from './route';
import { connectToDatabase } from '@utils/database';
import Task from '@models/task';

jest.mock('@utils/database', () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock('@models/task', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

describe('/api/tasks/[id] route handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PATCH', () => {
    it('updates an existing task and returns 200', async () => {
      const existingTask = {
        _id: 'task-1',
        creator: 'user-123',
        title: 'Old title',
        description: 'Old description',
        untilDate: '2026-05-01',
        priority: 'low',
        completed: false,
        save: jest.fn().mockResolvedValue(true),
      };

      Task.findById.mockResolvedValue(existingTask);

      const req = {
        json: jest.fn().mockResolvedValue({
          title: 'New title',
          description: 'Updated description',
          untilDate: '2026-05-10',
          priority: 'high',
          completed: true,
        }),
      };

      const response = await PATCH(req, { params: Promise.resolve({ id: 'task-1' }) });
      const body = await response.json();

      expect(connectToDatabase).toHaveBeenCalledTimes(1);
      expect(Task.findById).toHaveBeenCalledWith('task-1');
      expect(Task.findOne).toHaveBeenCalledWith({
        creator: 'user-123',
        title: 'New title',
        _id: { $ne: 'task-1' },
      });
      expect(existingTask.title).toBe('New title');
      expect(existingTask.description).toBe('Updated description');
      expect(existingTask.untilDate).toBe('2026-05-10');
      expect(existingTask.priority).toBe('high');
      expect(existingTask.completed).toBe(true);
      expect(existingTask.save).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(body.title).toBe('New title');
    });

    it('rejects an edit that would duplicate another task title', async () => {
      const existingTask = {
        _id: 'task-1',
        creator: 'user-123',
        title: 'Old title',
        description: 'Old description',
        untilDate: '2026-05-01',
        priority: 'low',
        completed: false,
        save: jest.fn(),
      };

      Task.findById.mockResolvedValue(existingTask);
      Task.findOne.mockResolvedValueOnce({ _id: 'task-2' });

      const req = {
        json: jest.fn().mockResolvedValue({
          title: 'New title',
          description: 'Updated description',
          untilDate: '2026-05-10',
          priority: 'high',
          completed: true,
        }),
      };

      const response = await PATCH(req, { params: Promise.resolve({ id: 'task-1' }) });
      const body = await response.text();

      expect(Task.findOne).toHaveBeenCalledWith({
        creator: 'user-123',
        title: 'New title',
        _id: { $ne: 'task-1' },
      });
      expect(existingTask.save).not.toHaveBeenCalled();
      expect(response.status).toBe(409);
      expect(body).toBe('Task with this title already exists');
    });

    it('returns 404 when the task does not exist', async () => {
      Task.findById.mockResolvedValue(null);

      const req = {
        json: jest.fn().mockResolvedValue({
          title: 'Missing',
          description: '',
          untilDate: '2026-05-10',
          priority: 'medium',
          completed: false,
        }),
      };

      const response = await PATCH(req, { params: Promise.resolve({ id: 'missing-id' }) });
      const body = await response.text();

      expect(response.status).toBe(404);
      expect(body).toBe('Task not found');
    });
  });

  describe('DELETE', () => {
    it('deletes a task and returns 200', async () => {
      Task.findByIdAndDelete.mockResolvedValue({ _id: 'task-1' });

      const response = await DELETE({}, { params: Promise.resolve({ id: 'task-1' }) });
      const body = await response.text();

      expect(connectToDatabase).toHaveBeenCalledTimes(1);
      expect(Task.findByIdAndDelete).toHaveBeenCalledWith('task-1');
      expect(response.status).toBe(200);
      expect(body).toBe('Task deleted successfully');
    });

    it('returns 404 when deleting a non-existent task', async () => {
      Task.findByIdAndDelete.mockResolvedValue(null);

      const response = await DELETE({}, { params: Promise.resolve({ id: 'missing-id' }) });
      const body = await response.text();

      expect(connectToDatabase).toHaveBeenCalledTimes(1);
      expect(Task.findByIdAndDelete).toHaveBeenCalledWith('missing-id');
      expect(response.status).toBe(404);
      expect(body).toBe('Task not found');
    });

    it('returns 500 when deletion fails', async () => {
      Task.findByIdAndDelete.mockRejectedValue(new Error('delete failed'));

      const response = await DELETE({}, { params: Promise.resolve({ id: 'task-1' }) });
      const body = await response.text();

      expect(response.status).toBe(500);
      expect(body).toBe('Failed to delete task');
    });
  });
});
