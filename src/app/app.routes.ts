import { Routes } from '@angular/router';
import { TaskListPageComponent } from './task/task-list-page/task-list-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TaskListPageComponent,
  },

  {
    path: 'tasks',
    children: [
      {
        path: '',
        component: TaskListPageComponent,
      },
      {
        path: ':projectId',
        title: 'test',
        component: TaskListPageComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'tasks',
  },
];
