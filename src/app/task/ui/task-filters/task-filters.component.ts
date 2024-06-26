import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Subscription, debounceTime, startWith } from 'rxjs';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

type TasksListFiltersForm = FormGroup<{
  searchTerm: FormControl<string>;
}>;

export type TaskFilterValue = ReturnType<TasksListFiltersForm['getRawValue']>;

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-filters.component.html',
  styleUrl: './task-filters.component.scss',
})
export class TaskFiltersComponent {
  private formBuilder = inject(NonNullableFormBuilder);

  @Output() filtersChange = new EventEmitter<any>();

  form: TasksListFiltersForm = this.formBuilder.group({
    searchTerm: this.formBuilder.control<string>(''),
  });

  private formChangesSubscription?: Subscription;

  ngOnInit() {
    this.formChangesSubscription = this.form.valueChanges
      .pipe(startWith(this.form.value), debounceTime(200))
      .subscribe((value) => {
        this.filtersChange.emit(value);
      });
  }

  ngOnDestroy() {
    this.formChangesSubscription?.unsubscribe();
  }
}
