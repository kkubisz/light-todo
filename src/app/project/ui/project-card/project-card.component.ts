import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Project } from '../../model/Project';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [JsonPipe, RouterLink],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent implements OnInit {
  @Input({ required: true }) project!: Project;

  @Input() taskCount!: number;

  ngOnInit(): void {
    this.taskCount;
  }
}
