import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskListPageComponent } from './task/task-list-page/task-list-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TaskListPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'todo-v2';
}
