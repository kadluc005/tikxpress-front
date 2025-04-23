import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-create-event',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss'
})
export class CreateEventComponent {



  eventForm: FormGroup;
  isSubmitting = false;
  minDate = new Date();

  // Options pour les selects
  categories = ['Concert', 'Théâtre', 'Sport', 'Conférence', 'Festival', 'Exposition'];
  ticketTypes = ['Standard', 'VIP', 'Étudiant', 'Early Bird', 'Premium'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    // private snackBar: MatSnackBar
  ) {
    this.eventForm = this.fb.group({
      basicInfo: this.fb.group({
        title: ['', [Validators.required, Validators.maxLength(100)]],
        category: ['', Validators.required],
        description: ['', [Validators.required, Validators.maxLength(1000)]],
        featured: [false]
      }),
      dateInfo: this.fb.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required]
      }),
      locationInfo: this.fb.group({
        venue: ['', Validators.required],
        address: ['', Validators.required],
        city: ['', Validators.required],
        postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]]
      }),
      mediaInfo: this.fb.group({
        mainImage: ['', Validators.required],
        galleryImages: [[]]
      }),
      ticketsInfo: this.fb.array([
        this.createTicketFormGroup()
      ])
    });
  }

  createTicketFormGroup() {
    return this.fb.group({
      type: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      benefits: [[]],
      saleStart: [''],
      saleEnd: ['']
    });
  }

  addTicketType() {
    const ticketsArray = this.eventForm.get('ticketsInfo') as any;
    ticketsArray.push(this.createTicketFormGroup());
  }

  removeTicketType(index: number) {
    const ticketsArray = this.eventForm.get('ticketsInfo') as any;
    if (ticketsArray.length > 1) {
      ticketsArray.removeAt(index);
    }
  }

  onSubmit() {
    if (this.eventForm.invalid) {
      this.markFormGroupTouched(this.eventForm);
      return;
    }

    this.isSubmitting = true;
    
    // Simulation d'envoi au backend
    setTimeout(() => {
      console.log('Événement créé:', this.eventForm.value);
      this.isSubmitting = false;
      
      // this.snackBar.open('Événement créé avec succès!', 'Fermer', {
      //   duration: 3000,
      //   panelClass: ['success-snackbar']
      // });
      
      this.router.navigate(['/admin/events/list']);
    }, 1500);
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  stepCompleted(stepIndex: number): boolean {
    switch(stepIndex) {
      case 0: return this.basicInfo.valid;
      case 1: return this.dateInfo.valid;
      case 2: return this.locationInfo.valid;
      case 3: return this.mediaInfo.valid;
      case 4: return this.ticketsInfo.valid;
      default: return false;
    }
  }

  goForward(stepper: MatStepper) {
    this.completedSteps[stepper.selectedIndex] = this.stepCompleted(stepper.selectedIndex);
    if (this.completedSteps[stepper.selectedIndex]) {
      stepper.next();
    } else {
      this.markCurrentStepAsTouched(stepper);
    }
  }

  markCurrentStepAsTouched(stepper: MatStepper) {
    switch(stepper.selectedIndex) {
      case 0: this.markFormGroupTouched(this.basicInfo); break;
      case 1: this.markFormGroupTouched(this.dateInfo); break;
      case 2: this.markFormGroupTouched(this.locationInfo); break;
      case 3: this.markFormGroupTouched(this.mediaInfo); break;
      case 4: this.markFormGroupTouched(this.ticketsInfo); break;
    }
  }

  onFileSelected($event: Event) {
    throw new Error('Method not implemented.');
  }
  removeBenefit(_t196: number,_t268: number) {
    throw new Error('Method not implemented.');
  }
  addBenefit(_t196: number,_t262: HTMLInputElement) {
    throw new Error('Method not implemented.');
  }
  removeGalleryImage(_t184: number) {
    throw new Error('Method not implemented.');
  }
  onGalleryFilesSelected($event: Event) {
    throw new Error('Method not implemented.');
  }

  // Helper pour accéder aux sous-formulaires
  get basicInfo() { return this.eventForm.get('basicInfo') as FormGroup; }
  get dateInfo() { return this.eventForm.get('dateInfo') as FormGroup; }
  get locationInfo() { return this.eventForm.get('locationInfo') as FormGroup; }
  get mediaInfo() { return this.eventForm.get('mediaInfo') as FormGroup; }
  get ticketsInfo() { return this.eventForm.get('ticketsInfo') as any; }
}
