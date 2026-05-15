export const filterTasks = (tasks, searchText) => {
  const regex = new RegExp(searchText, 'i');

  return tasks.filter(
    (task) => regex.test(task.title) || regex.test(task.description || '')
  );
};
