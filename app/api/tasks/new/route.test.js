import { POST } from './route';
import { connectToDatabase } from '@utils/database';
import Task from '@models/task';

jest.mock('@utils/database', () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock('@models/task', () => {
  const MockTask = jest.fn().mockImplementation(function Task(data) {
    this.creator = data.creator;
    this.title = data.title;
    this.description = data.description;
    this.untilDate = data.untilDate;
    this.priority = data.priority;
    this.completed = data.completed;
    this.save = jest.fn().mockResolvedValue(this);
  });

  return {
    __esModule: true,
    default: MockTask,
  };
});

describe('POST /api/tasks/new', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Task.findOne = jest.fn().mockResolvedValue(null);
  });

  it('creates a task and returns 201', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        userId: 'user-123',
        title: 'Finish testing',
        description: 'Write API unit tests',
        untilDate: '2026-05-01',
        priority: 'high',
      }),
    };

    const response = await POST(req);
    const body = await response.json();

    expect(connectToDatabase).toHaveBeenCalledTimes(1);
    expect(Task.findOne).toHaveBeenCalledWith({
      creator: 'user-123',
      title: 'Finish testing',
    });
    expect(Task).toHaveBeenCalledWith({
      creator: 'user-123',
      title: 'Finish testing',
      description: 'Write API unit tests',
      untilDate: new Date('2026-05-01'),
      priority: 'high',
      completed: false,
    });
    expect(response.status).toBe(201);
    expect(body.title).toBe('Finish testing');
    expect(body.completed).toBe(false);
  });

  it('rejects duplicate task titles for the same user', async () => {
    Task.findOne.mockResolvedValueOnce({ _id: 'existing-task' });

    const req = {
      json: jest.fn().mockResolvedValue({
        userId: 'user-123',
        title: 'Finish testing',
        description: 'Write API unit tests',
        untilDate: '2026-05-01',
        priority: 'high',
      }),
    };

    const response = await POST(req);
    const body = await response.text();

    expect(connectToDatabase).toHaveBeenCalledTimes(1);
    expect(Task.findOne).toHaveBeenCalledWith({
      creator: 'user-123',
      title: 'Finish testing',
    });
    expect(Task).not.toHaveBeenCalled();
    expect(response.status).toBe(409);
    expect(body).toBe('Task with this title already exists');
  });

  it('returns 400 when required fields are missing', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        userId: 'user-123',
        title: '   ',
        description: 'Write API unit tests',
        untilDate: '',
        priority: 'high',
      }),
    };

    const response = await POST(req);
    const body = await response.text();

    expect(connectToDatabase).toHaveBeenCalledTimes(1);
    expect(Task.findOne).not.toHaveBeenCalled();
    expect(Task).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(body).toBe('Missing required fields');
  });

  it('returns 500 when saving fails', async () => {
    Task.mockImplementationOnce(function Task(data) {
      Object.assign(this, data);
      this.save = jest.fn().mockRejectedValue(new Error('save failed'));
    });

    const req = {
      json: jest.fn().mockResolvedValue({
        userId: 'user-123',
        title: 'Broken task',
        description: '',
        untilDate: '2026-05-01',
        priority: 'medium',
      }),
    };

    const response = await POST(req);
    const body = await response.text();

    expect(response.status).toBe(500);
    expect(body).toBe('Failed to create a new task');
  });
});
