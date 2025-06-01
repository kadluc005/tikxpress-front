import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-email-modal',
  imports: [CommonModule, MatIconModule, MatFormFieldModule, FormsModule, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './email-modal.component.html',
  styleUrl: './email-modal.component.scss',
})
export class EmailModalComponent {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() emailSubmitted = new EventEmitter<string>();
  @Input() defaultEmail: string = '';

  ngOnInit() {
    this.email = this.defaultEmail || '';
  }

  email = '';
  loading = false;

  onClose() {
    this.close.emit();
  }

  submitEmail() {
    if (!this.email || !/\S+@\S+\.\S+/.test(this.email)) return;

    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.emailSubmitted.emit(this.email);
      this.onClose();
    }, 1500); // Simulation d'envoi
  }
}
