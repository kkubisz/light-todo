import { AfterViewInit, Component, Input } from '@angular/core';
import { Project } from '../../model/Project';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

type taskCountByProjectId = { [projectId: number]: number };

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [JsonPipe, RouterLink],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent implements AfterViewInit {
  count = 0;
  @Input({ required: true }) project!: Project;

  @Input() taskCount!: taskCountByProjectId;

  ngAfterViewInit(): void {
    this.count = this.taskCount[this.project.id];
  }
}
