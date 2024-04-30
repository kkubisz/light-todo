import { Component, Input, OnInit, inject } from '@angular/core';
import { TaskCardComponent } from '../task-card/task-card.component';
import { Task } from '../../model/Task';
import { TaskService } from '../../data-access/task.service';
import { SnackbarComponent } from '../../../ui/snackbar/snackbar.component';
import { ModalComponent } from '../../../ui/modal/modal.component';

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

  updateTask(taskId: number, updatedTask: any) {
    this.tasksService.update(taskId, updatedTask).subscribe({
      next: (response) => {
        this.tasks = this.tasks.map((task) => {
          if (task.id === response.id) {
            return response;
          } else {
            return task;
          }
        });
      },
      error: (error) => {
        alert(error.message);
      },
    });
  }

  removeTask(taskId: number) {
    this.tasksService.delete(taskId).subscribe({
      next: (response) => {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        this.snackBarMessage = 'Task has been remove';
      },
      error: (error) => {
        this.snackBarMessage = error.message;
      },
    });
  }
}
