import { JsonPipe, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  Signal,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { featherPlusCircle } from '@ng-icons/feather-icons';
import { Project } from '../../project/model/Project';
import { ProjectService } from '../../project/data-access/project.service';
import { ModalService } from '../../utils/modal/modal-service';
import { Task } from '../../task/model/Task';
import { LoggerToken } from '@ng-icons/core/lib/providers/features/logger';

type TasksListFiltersForm = FormGroup<{
  name: FormControl<string>;
  project: FormControl<string>;
  description: FormControl<string>;
  projectId: FormControl<string>;
}>;

export type TasksListFiltersFormValue = ReturnType<
  TasksListFiltersForm['getRawValue']
>;

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgIf, NgIconComponent, ReactiveFormsModule, JsonPipe],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  viewProviders: [provideIcons({ featherPlusCircle })],
})
export class ModalComponent implements OnInit {
  private formBuilder = inject(NonNullableFormBuilder);
  private projectService = inject(ProjectService);

  modalService = inject(ModalService);

  taskSignal: Signal<Task | null> = signal(null);
  taskService = this.modalService.task();

  @Output() addTask = new EventEmitter<TasksListFiltersFormValue>();
  @Output() addProject = new EventEmitter();
  @Output() editTask = new EventEmitter<{
    data: TasksListFiltersFormValue;
    taskId: number;
  }>();

  //TOOD how to pass properties from task into form like name/description/etc. Neccessary in edit mode

  form: TasksListFiltersForm = this.formBuilder.group({
    name: this.formBuilder.control<string>(''),
    project: this.formBuilder.control<string>(''),
    description: this.formBuilder.control<string>(''),
    projectId: this.formBuilder.control<string>('1'),
  });

  project: Project[] = [];

  ngOnInit(): void {
    this.getAllProject();

    this.taskSignal = computed(() => {
      const task = this.modalService.task();
      if (task !== null) {
        this.setFormProperties(task);
      }

      return task;
    });
  }

  onSubmit(editMode: boolean) {
    if (editMode) {
      if (this.modalService.task()) {
        const taskId = this.modalService.task()?.id;

        if (taskId) {
          this.editTask.emit({ data: this.form.getRawValue(), taskId: taskId });

          return;
        }
      }
    }
    this.addTask.emit(this.form.getRawValue());
  }

  setFormProperties(task: Task) {
    this.form.controls.name.setValue(task.name);
    this.form.controls.description.setValue(task.description);
    this.form.controls.projectId.setValue(task.projectId.toString());
  }
  addNewProject() {
    const form = this.form.getRawValue();
    const projectName = form.project;
    if (projectName) {
      this.projectService.add(projectName).subscribe({
        next: (response) => {
          this.project.push(response);

          this.form.get('projectId')?.setValue(response.id.toString());
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  getAllProject() {
    this.projectService.getAll().subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.project = response;
          this.form.get('project')?.setValue('');
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
