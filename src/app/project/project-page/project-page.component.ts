import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { ProjectService } from '../data-access/project.service';
import { Project } from '../model/Project';
import { ProjectCardComponent } from '../ui/project-card/project-card.component';
import { Task } from '../../task/model/Task';
import { Subscription } from 'rxjs';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [ProjectCardComponent, JsonPipe],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss',
})
export class ProjectPageComponent implements OnInit, OnDestroy {
  @Input({ required: true }) tasks!: Task[];

  private projectService = inject(ProjectService);

  count: number = 0;

  project: Project[] = [];

  sub!: Subscription;
  projectSubscription!: Subscription;

  taskCountByProjectId: { [projectId: number]: number } = {};

  getAllProjects() {
    this.projectService.getAll().subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.project = response;
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ngOnInit(): void {
    this.getAllProjects();

    this.getProjectCount(this.tasks);

    this.sub = this.projectService.projectChanged.subscribe({
      next: (tasks: any) => {
        this.tasks = tasks;
        this.getProjectCount(tasks);
      },
    });

    this.projectSubscription = this.projectService.projectTaskCount.subscribe({
      next: (project: any) => {
        this.project.push(project);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProjectCount(tasks: Task[]) {
    this.resetTaskCountByProjectId();
    tasks.forEach((task) => {
      if (this.taskCountByProjectId[task.projectId]) {
        this.taskCountByProjectId[task.projectId]++;
      } else {
        this.taskCountByProjectId[task.projectId] = 1;
      }
    });
  }

  resetTaskCountByProjectId() {
    this.taskCountByProjectId = {};
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.projectSubscription.unsubscribe();
  }
}
