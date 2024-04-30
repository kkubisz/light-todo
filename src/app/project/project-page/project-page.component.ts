import { Component, Input, OnInit, inject } from '@angular/core';
import { ProjectService } from '../data-access/project.service';
import { Project } from '../model/Project';
import { ProjectCardComponent } from '../ui/project-card/project-card.component';
import { Task } from '../../task/model/Task';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [ProjectCardComponent],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss',
})
export class ProjectPageComponent implements OnInit {
  @Input({ required: true }) tasks!: Task[];

  private projectService = inject(ProjectService);

  project: Project[] = [];

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

    this.tasks.forEach((task) => {
      if (this.taskCountByProjectId[task.projectId]) {
        this.taskCountByProjectId[task.projectId]++;
      } else {
        this.taskCountByProjectId[task.projectId] = 1;
      }
    });
  }
}
