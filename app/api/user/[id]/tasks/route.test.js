import { GET } from './route';
import { connectToDatabase } from '@utils/database';
import Task from '@models/task';

jest.mock('@utils/database', () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock('@models/task', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
  },
}));

describe('GET /api/user/[id]/tasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all tasks for the requested user with full task information', async () => {
    const tasks = [
      {
        _id: 'task-1',
        creator: { _id: 'user-123', email: 'user@example.com' },
        title: 'Prepare slides',
        description: 'Quarterly review deck',
        priority: 'medium',
        untilDate: '2026-05-10T00:00:00.000Z',
        completed: false,
      },
      {
        _id: 'task-2',
        creator: { _id: 'user-123', email: 'user@example.com' },
        title: 'Review budget',
        description: 'Check expense totals',
        priority: 'high',
        untilDate: '2026-05-12T00:00:00.000Z',
        completed: true,
      },
    ];

    const populate = jest.fn().mockResolvedValue(tasks);
    Task.find.mockReturnValue({ populate });

    const response = await GET({}, { params: Promise.resolve({ id: 'user-123' }) });
    const body = await response.json();

    expect(connectToDatabase).toHaveBeenCalledTimes(1);
    expect(Task.find).toHaveBeenCalledWith({ creator: 'user-123' });
    expect(populate).toHaveBeenCalledWith('creator');
    expect(response.status).toBe(200);
    expect(body).toEqual(tasks);
  });

  it('returns 500 when user task report retrieval fails', async () => {
    const populate = jest.fn().mockRejectedValue(new Error('query failed'));
    Task.find.mockReturnValue({ populate });

    const response = await GET({}, { params: Promise.resolve({ id: 'user-123' }) });
    const body = await response.text();

    expect(response.status).toBe(500);
    expect(body).toBe('Failed to fetch tasks');
  });
});
