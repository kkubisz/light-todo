// modal.service.ts
import { Injectable, WritableSignal, signal } from '@angular/core';
import { Task } from '../../task/model/Task';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modalState: boolean = false;
  task: WritableSignal<Task | null> = signal(null);
  editMode: boolean = false;

  $value = this.task.asReadonly();

  openModal(task?: Task, editMode = false) {
    this.modalState = true;
    this.editMode = editMode;

    if (task) {
      this.task.set(task);
    }
  }
  closeModal() {
    this.modalState = false;
  }
}
