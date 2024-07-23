import { Component, Input, inject } from '@angular/core';
import { TaskCardComponent } from '../task-card/task-card.component';
import { Task } from '../../model/Task';
import { TaskService } from '../../data-access/task.service';
import { SnackbarComponent } from '../../../ui/snackbar/snackbar.component';
import {
  ModalComponent,
  TasksListFiltersFormValue,
} from '../../../ui/modal/modal.component';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskCardComponent, SnackbarComponent, ModalComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  @Input({ required: true }) tasks: Task[] = [];

  @Input()
  private tasksService = inject(TaskService);

  snackBarMessage = '';

  updateTask(taskId: number, updatedTask: TasksListFiltersFormValue) {
    this.tasksService
      .update(taskId, updatedTask)
      .pipe(
        map((response) => {
          this.tasks = this.tasks.map((task) => {
            return task.id === response.id ? response : task;
          });
          return response;
        }),
        catchError((error) => {
          alert(error.message);
          return of(null);
        })
      )
      .subscribe();
  }

  removeTask(taskId: number) {
    this.tasksService.delete(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        this.snackBarMessage = 'Task has been remove';
      },
      error: (error) => {
        this.snackBarMessage = error.message;
      },
    });
  }
}
