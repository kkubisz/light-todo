import { Injectable, signal } from '@angular/core';
import { Task } from '../../task/model/Task';

export type ShowModalType = boolean;

type AppConfigState = {
  showModal: ShowModalType;
  editedTask: Task | null;
};

@Injectable({
  providedIn: 'root',
})
export class AppConfigStateService {
  private state = signal<AppConfigState>({
    showModal: false,
    editedTask: null,
  });

  $value = this.state.asReadonly();

  updateModal(value: ShowModalType) {
    this.state.update((state) => {
      return {
        ...state,
        showModal: value,
      };
    });
  }

  editedTask(value: Task | null) {
    this.state.update((state) => {
      return {
        ...state,
        editedTask: value,
      };
    });
  }
}
