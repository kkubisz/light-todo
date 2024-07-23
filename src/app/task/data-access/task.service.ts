import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Task } from '../model/Task';
import { Observable, tap } from 'rxjs';
import { TasksListFiltersFormValue } from '../../ui/modal/modal.component';

export type TaskUpdatePayload = {
  done?: boolean;
  name?: string;
  urgent?: boolean;
};

export type GetAllTasksSearchParams = {
  q: string;
};

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private TaskSeriveURL = 'http://localhost:3000';

  private http = inject(HttpClient);

  getAll(
    searchParams: GetAllTasksSearchParams
  ): Observable<HttpResponse<Task[]>> {
    return this.http.get<Task[]>(`${this.TaskSeriveURL}/tasks`, {
      observe: 'response',
      params: searchParams,
    });
  }

  delete(taskId: number): Observable<object> {
    return this.http.delete(`${this.TaskSeriveURL}/tasks/${taskId}`);
  }

  update(taskId: number, payload: TasksListFiltersFormValue): Observable<Task> {
    return this.http.patch<Task>(
      `${this.TaskSeriveURL}/tasks/${taskId}`,
      payload
    );
  }

  add(name: string, description: string, projectId: number): Observable<Task> {
    return this.http.post<Task>(`${this.TaskSeriveURL}/tasks`, {
      name,
      description,
      done: false,
      createdAt: Date.now(),
      projectId,
    });
  }

  getAllByProjectId(
    projectId: string,
    searchParams: GetAllTasksSearchParams
  ): Observable<HttpResponse<Task[]>> {
    return this.http
      .get<Task[]>(`${this.TaskSeriveURL}/tasks`, {
        observe: 'response',
        params: { ...searchParams, projectId },
      })
      .pipe(
        tap((response) => {
          if (response.body) {
            response.body;
          } else {
            null;
          }
        })
      );
  }
}
