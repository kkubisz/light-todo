import { Routes } from '@angular/router';
import { TaskListPageComponent } from './task/task-list-page/task-list-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./task/task-list-page/task-list-page.component').then(
        (m) => m.TaskListPageComponent
      ),
  },

  {
    path: 'tasks',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./task/task-list-page/task-list-page.component').then(
            (m) => m.TaskListPageComponent
          ),
      },
      {
        path: ':projectId',
        title: 'test',
        loadComponent: () =>
          import('./task/task-list-page/task-list-page.component').then(
            (m) => m.TaskListPageComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'tasks',
  },
];
