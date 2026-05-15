import { filterTasks } from './filterTasks';

describe('filterTasks', () => {
  const tasks = [
    { title: 'Buy milk', description: 'From the store', priority: 'low', completed: false },
    { title: 'Finish homework', description: 'Math exercises', priority: 'high', completed: true },
    { title: 'Call mom', description: '', priority: 'medium', completed: false },
  ];

  it('matches tasks by title and description without case sensitivity', () => {
    expect(filterTasks(tasks, 'milk')).toEqual([tasks[0]]);
    expect(filterTasks(tasks, 'MATH')).toEqual([tasks[1]]);
  });

  it('returns all matching tasks when several items satisfy the search criteria', () => {
    expect(filterTasks(tasks, 'm')).toEqual(tasks);
  });

  it('handles tasks with missing descriptions while still filtering by title', () => {
    const tasksWithMissingDescription = [
      { title: 'Team meeting', priority: 'medium' },
      { title: 'Plan trip', description: null, priority: 'low' },
    ];

    expect(filterTasks(tasksWithMissingDescription, 'team')).toEqual([tasksWithMissingDescription[0]]);
    expect(filterTasks(tasksWithMissingDescription, 'trip')).toEqual([tasksWithMissingDescription[1]]);
  });

  it('keeps filtering focused on searchable text fields only', () => {
    expect(filterTasks(tasks, 'high')).toEqual([]);
    expect(filterTasks(tasks, 'true')).toEqual([]);
  });

  it('returns an empty array when no tasks match', () => {
    expect(filterTasks(tasks, 'meeting')).toEqual([]);
  });

  it('returns an empty array when the task list is empty', () => {
    expect(filterTasks([], 'meeting')).toEqual([]);
  });

  it('returns an empty array for non-existent records even with exact search text', () => {
    expect(filterTasks(tasks, 'Submit taxes')).toEqual([]);
  });
});
