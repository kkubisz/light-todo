import { TaskFilterValue } from '../ui/task-filters/task-filters.component';
import { GetAllTasksSearchParams } from './task.service';

export function getAllTasksSearchParams(
  formValue: TaskFilterValue
): GetAllTasksSearchParams {
  const searchParams = {
    q: formValue.searchTerm,
  } as GetAllTasksSearchParams;

  return searchParams;
}
