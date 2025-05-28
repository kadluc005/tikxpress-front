import { Component, Inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MapComponent } from '../map/map.component';
import { CommonModule } from '@angular/common';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-event-modal',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    MatFormField,
    MatInputModule,
    MapComponent,
    MatOption,
    MatSelect,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './edit-event-modal.component.html',
  styleUrl: './edit-event-modal.component.scss',
})
export class EditEventModalComponent implements OnInit {
  onFileSelected($event: Event) {
  throw new Error('Method not implemented.');
  }
  onCoordinatesChange($event: {
    latitude: number | null;
    longitude: number | null;
  }) {
    throw new Error('Method not implemented.');
  }

  eventForm!: FormGroup;
  isSubmitting = false;
  categories = ['Musique', 'Sport', 'Théâtre']; // exemple

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditEventModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.eventForm = this.fb.group({
      basicInfo: this.fb.group({
        nom: [
          this.data.nom || '',
          [Validators.required, Validators.maxLength(100)],
        ],
        type: [this.data.type || '', Validators.required],
        description: [
          this.data.description || '',
          [Validators.required, Validators.maxLength(1000)],
        ],
        featured: [this.data.featured || false],
      }),
      dateInfo: this.fb.group(
        {
          date_debut: [this.data.date_debut || '', Validators.required],
          date_fin: [this.data.date_fin || '', Validators.required],
        },
        { validators: this.dateValidator }
      ),
      locationInfo: this.fb.group({
        venue: [this.data.venue || '', Validators.required],
      }),
      mediaInfo: this.fb.group({
        mainImage: [this.data.mainImage || ''],
        galleryImages: this.fb.array([]),
      }),
      ticketsInfo: this.fb.array(
        this.data.tickets?.map((t: any) => this.createTicketFormGroup(t)) || [
          this.createTicketFormGroup(),
        ]
      ),
    });
  }

  ngOnInit(): void {
    
  }

  dateValidator(group: FormGroup) {
    const start = group.get('date_debut')?.value;
    const end = group.get('date_fin')?.value;
    return start && end && start <= end ? null : { dateInvalid: true };
  }

  get ticketsInfo(): FormArray {
    return this.eventForm.get('ticketsInfo') as FormArray;
  }

  createTicketFormGroup(ticket: any = {}): FormGroup {
    return this.fb.group({
      type: [ticket.type || '', Validators.required],
      price: [ticket.price || 0, Validators.required],
      quantity: [ticket.quantity || 0, Validators.required],
      benefits: [ticket.benefits || []],
    });
  }

  addTicketType() {
    this.ticketsInfo.push(this.createTicketFormGroup());
  }

  removeTicketType(index: number) {
    this.ticketsInfo.removeAt(index);
  }

  addBenefit(ticketIndex: number, input: HTMLInputElement) {
    const benefit = input.value.trim();
    if (benefit) {
      const control = this.ticketsInfo.at(ticketIndex).get('benefits')!;
      const current = control.value || [];
      control.setValue([...current, benefit]);
      input.value = '';
    }
  }

  removeBenefit(ticketIndex: number, benefitIndex: number) {
    const control = this.ticketsInfo.at(ticketIndex).get('benefits')!;
    const current = control.value || [];
    current.splice(benefitIndex, 1);
    control.setValue([...current]);
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.isSubmitting = true;
      // Appelle ton service pour modifier l'event ici si tu veux
      this.dialogRef.close(this.eventForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
