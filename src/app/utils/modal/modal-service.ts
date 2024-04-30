// modal.service.ts
import { Injectable, WritableSignal, signal } from '@angular/core';
import { Task } from '../../task/model/Task';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modalState: boolean = false;
  task: WritableSignal<Task[]> = signal([]);
  editMode: boolean = false;

  $value = this.task.asReadonly();

  openModal(task?: Task, editMode = false) {
    this.modalState = true;
    this.editMode = editMode;

    if (task) {
      this.task.update((test) => [task, ...test]);
    }
  }
  closeModal() {
    this.modalState = false;
  }
}
