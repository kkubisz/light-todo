import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Task } from '../../model/Task';
import { DatePipe } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { featherDelete, featherEdit3 } from '@ng-icons/feather-icons';
import { ModalComponent } from '../../../ui/modal/modal.component';
import { AppConfigStateService } from '../../../utils/modal-signal/modal-singal';
import { ModalService } from '../../../utils/modal/modal-service';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [DatePipe, NgIconComponent, ModalComponent],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  viewProviders: [provideIcons({ featherEdit3, featherDelete })],
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;

  @Output() update = new EventEmitter();
  @Output() remove = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();

  configStateService = inject(AppConfigStateService);
  modalService = inject(ModalService);

  updateTask() {
    this.update.emit({ done: !this.task.done });
  }

  removeTask(event: Event) {
    event?.stopPropagation();
    this.remove.emit();
  }

  editTask(event: Event, task: Task) {
    event?.stopPropagation();

    this.modalService.openModal(task, true);
  }
}
