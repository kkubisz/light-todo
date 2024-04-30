import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Project } from '../model/Project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private TaskSeriveURL = 'http://localhost:3000';

  private http = inject(HttpClient);

  getAll() {
    return this.http.get<Project>(`${this.TaskSeriveURL}/projects`);
  }

  delete(projectId: number) {
    return this.http.delete(`${this.TaskSeriveURL}/projects/${projectId}`);
  }

  add(name: string) {
    return this.http.post<Project>(`${this.TaskSeriveURL}/projects`, {
      name,
      createdAt: Date.now(),
    });
  }
}
