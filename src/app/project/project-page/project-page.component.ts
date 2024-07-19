import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { ProjectService } from '../data-access/project.service';
import { Project } from '../model/Project';
import { ProjectCardComponent } from '../ui/project-card/project-card.component';
import { Task } from '../../task/model/Task';
import { catchError, filter, Observable, of, Subscription, tap } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [ProjectCardComponent, JsonPipe],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss',
})
export class ProjectPageComponent implements OnInit {
  @Input({ required: true }) tasks!: Task[];

  private projectService = inject(ProjectService);
  private destroyRef = inject(DestroyRef);

  project: Project[] = [];

  project$ = this.getAllProjects();

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

    this.projectService.projectChanged
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tasks: any) => {
          this.tasks = tasks;
          this.getProjectCount(tasks);
        },
      });

    this.projectService.projectTaskCount
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
}
