import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-payment-modal',
  imports: [CommonModule, MatIconModule],
  templateUrl: './payment-modal.component.html',
  styleUrl: './payment-modal.component.scss'
})
export class PaymentModalComponent {

  @Input() visible: boolean = false;
  @Input() totalAmount: number = 0;
  @Output() close = new EventEmitter<void> ();
  @Output() paymentSelected = new EventEmitter<string> ();

  selectPayment(method: string) {
    this.paymentSelected.emit(method);
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }

}
