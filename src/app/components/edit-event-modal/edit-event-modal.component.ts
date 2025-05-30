import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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
  standalone: true,
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
  styleUrls: ['./edit-event-modal.component.scss'],
})
export class EditEventModalComponent implements OnInit {
  onFileSelected($event: Event) {
    throw new Error('Method not implemented.');
  }
  @ViewChild(MapComponent)
  location!: MapComponent;
  longitude: number |null = null;
  latitude: number | null = null;
  onCoordinatesChange(coords: {latitude: number | null, longitude: number | null}) {
    if (coords.latitude !== null && coords.longitude !== null) {
      this.latitude = coords.latitude;
      this.longitude = coords.longitude;
      console.log('Coordonnées mises à jour depuis la recherche:', this.latitude, this.longitude);
    } 
   
  }

  eventForm!: FormGroup;
  isSubmitting = false;
  categories = ['Concert', 'Théâtre', 'Sport', 'Conférence', 'Festival', 'Exposition'];

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
      }),
      dateInfo: this.fb.group(
        {
          date_debut: [this.data.date_debut || '', Validators.required],
          date_fin: [this.data.date_fin || '', Validators.required],
        },
        { validators: this.dateValidator }
      ),
      locationInfo: this.fb.group({
        venue: [this.data.lieu || '', Validators.required],
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
      type: [ticket.libelle || '', Validators.required],
      price: [ticket.peix || 0, Validators.required],
      quantity: [ticket.quantite || 0, Validators.required],
      benefits: [ticket.privilege || []],
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


  get basicInfo(): FormGroup {
    return this.eventForm.get('basicInfo') as FormGroup;
  }

  get dateInfo(): FormGroup {
    return this.eventForm.get('dateInfo') as FormGroup;
  }

  get locationInfo(): FormGroup {
    return this.eventForm.get('locationInfo') as FormGroup;
  }

}
