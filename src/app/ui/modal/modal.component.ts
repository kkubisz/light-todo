import { JsonPipe, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
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
export class ModalComponent implements OnInit, OnChanges {
  private formBuilder = inject(NonNullableFormBuilder);
  private projectService = inject(ProjectService);

  modalService = inject(ModalService);
  task: Task | undefined;

  @Output() addTask = new EventEmitter<TasksListFiltersFormValue>();
  @Output() addProject = new EventEmitter();
  @Output() editTask = new EventEmitter<TasksListFiltersFormValue>();

  form: TasksListFiltersForm = this.formBuilder.group({
    name: this.formBuilder.control<string>(''),
    project: this.formBuilder.control<string>(''),
    description: this.formBuilder.control<string>(''),
    projectId: this.formBuilder.control<string>('1'),
  });

  project: Project[] = [];

  ngOnInit(): void {
    this.getAllProject();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  onSubmit(editMode: boolean) {
    console.log(this.form.getRawValue());

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
