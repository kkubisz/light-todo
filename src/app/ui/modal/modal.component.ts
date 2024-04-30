import { JsonPipe, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  computed,
  inject,
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

  task = computed(() => this.modalService.task());

  @Output() addTask = new EventEmitter<TasksListFiltersFormValue>();
  @Output() addProject = new EventEmitter();
  @Output() editTask = new EventEmitter<TasksListFiltersFormValue>();

  //TOOD how to pass properties from task into form like name/description/etc. Neccessary in edit mode
  taskResult = this.task();
  name = this.taskResult !== null ? this.taskResult.name : 'test';

  form: TasksListFiltersForm = this.formBuilder.group({
    name: this.formBuilder.control<string>(this.name),
    project: this.formBuilder.control<string>(''),
    description: this.formBuilder.control<string>(''),
    projectId: this.formBuilder.control<string>('1'),
  });

  project: Project[] = [];

  ngOnInit(): void {
    this.getAllProject();
  }

  onSubmit(editMode: boolean) {
    if (editMode) {
      this.editTask.emit(this.form.getRawValue());
    }
    this.addTask.emit(this.form.getRawValue());
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
