import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent {
  @Input() message: string = '';

  ngOnInit(): void {
    setTimeout(() => {
      this.message = '';
    }, 2000);
  }
}
