import { Component, Input, OnInit, inject } from '@angular/core';
import { TaskListComponent } from '../ui/task-list/task-list.component';
import {
  GetAllTasksSearchParams,
  TaskService,
} from '../data-access/task.service';
import {
  ComponentListState,
  LIST_STATE_VALUE,
} from '../../utils/list-state.type';
import { Task } from '../model/Task';
import {
  ModalComponent,
  TasksListFiltersFormValue,
} from '../../ui/modal/modal.component';
import { SnackbarComponent } from '../../ui/snackbar/snackbar.component';
import { SpinnerComponent } from '../../ui/spinner/spinner.component';
import { Project } from '../../project/model/Project';
import { ProjectPageComponent } from '../../project/project-page/project-page.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { featherPlusCircle } from '@ng-icons/feather-icons';
import { ModalService } from '../../utils/modal/modal-service';
import {
  TaskFilterValue,
  TaskFiltersComponent,
} from '../ui/task-filters/task-filters.component';
import { getAllTasksSearchParams } from '../data-access/tasks.filters.adapter';

@Component({
  selector: 'app-task-list-page',
  standalone: true,
  imports: [
    TaskListComponent,
    ModalComponent,
    SnackbarComponent,
    SpinnerComponent,
    ProjectPageComponent,
    NgIconComponent,
    TaskFiltersComponent,
  ],
  templateUrl: './task-list-page.component.html',
  styleUrl: './task-list-page.component.scss',
  viewProviders: [provideIcons({ featherPlusCircle })],
})
export class TaskListPageComponent implements OnInit {
  @Input() projectId?: string;
  listState: ComponentListState<Task> = { state: 'IDLE' };
  private tasksService = inject(TaskService);
  private modalSerive = inject(ModalService);

  project: Project[] = [];
  snackBarMessage = '';
  activatedRoute: any;

  ngOnInit() {
    this.listState = { state: 'LOADING' };
  }

  handleFiltersChange(filters: TaskFilterValue): void {
    this.getAllTasks(getAllTasksSearchParams(filters));
  }

  openModal() {
    this.modalSerive.openModal();
  }

  getAllTasks(filters: GetAllTasksSearchParams): void {
    const source$ = this.projectId
      ? this.tasksService.getAllByProjectId(this.projectId, filters)
      : this.tasksService.getAll(filters);

    source$.subscribe({
      next: (response) => {
        if (Array.isArray(response.body)) {
          this.listState = {
            state: 'SUCCESS',
            results: response.body,
          };
        }
      },
      error: (error) => {
        this.listState = {
          state: 'ERROR',
          error: error,
        };
      },
    });
  }

  addTask(form: TasksListFiltersFormValue, tasks: Task[]): void {
    const name = form.name;
    const description = form.description;
    const projectId = form.projectId;

    this.tasksService.add(name, description, +projectId).subscribe({
      next: (task) => {
        this.listState = {
          state: LIST_STATE_VALUE.SUCCESS,
          results: tasks.concat(task),
        };

        this.modalSerive.closeModal();
      },
      error: (err) => {
        this.snackBarMessage = err.message;
      },
    });
  }

  editTask($event: any, tasks: Task[]): void {
    const taskId = $event['taskId'];
    const data = $event['data'];

    this.tasksService.update(taskId, data).subscribe({
      next: (response) => {
        tasks = tasks.map((task) => {
          if (task.id === response.id) {
            return response;
          } else {
            return task;
          }
        });

        this.listState = {
          state: LIST_STATE_VALUE.SUCCESS,
          results: tasks,
        };
      },
      error: (error) => {
        alert(error.message);
      },

      complete: () => {
        this.modalSerive.closeModal();
      },
    });
  }
}
