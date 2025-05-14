import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EventsService } from '../../services/events.service';
import { BilletsService } from '../../services/billets.service';
import { CreateEventDto } from '../../models/event';
import { CreateTypeBilletDto } from '../../models/type-billets';


interface TicketType {
  type: string;
  price: number;
  quantity: number;
  benefits: string[];
  saleStart?: string;
  saleEnd?: string;
}

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule, 
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent {
  eventForm: FormGroup;
  isSubmitting = false;
  minDate = new Date();
  completedSteps = [false, false, false, false, false];
  token : string = localStorage.getItem('token') || '';

  categories = ['Concert', 'Théâtre', 'Sport', 'Conférence', 'Festival', 'Exposition'];
  ticketTypes = ['Standard', 'VIP', 'Étudiant', 'Early Bird', 'Premium'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private eventService: EventsService,
    private billetService: BilletsService,
  ) {
    this.eventForm = this.fb.group({
      basicInfo: this.fb.group({
        nom: ['', [Validators.required, Validators.maxLength(100)]],
        type: ['', Validators.required],
        description: ['', [Validators.required, Validators.maxLength(1000)]],
        featured: [false]
      }),
      dateInfo: this.fb.group({
        date_debut: ['', Validators.required],
        date_fin: ['', Validators.required],
        // startTime: ['', Validators.required],
        // endTime: ['', Validators.required]
      }, { validators: this.dateValidator }),
      locationInfo: this.fb.group({
        venue: ['', Validators.required],
        address: ['', Validators.required],
        city: ['', Validators.required],
        postalCode: ['', [Validators.required]]
        // postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]]
      }),
      mediaInfo: this.fb.group({
        mainImage: ['', Validators.required],
        galleryImages: this.fb.array([])
      }),
      ticketsInfo: this.fb.array([this.createTicketFormGroup()])
    });
  }

  

  private dateValidator(group: FormGroup) {
    const { startDate, endDate } = group.value;
    return (startDate && endDate && new Date(startDate) > new Date(endDate)) ? { dateRange: true } : null;
  }

  createTicketFormGroup(ticket?: TicketType): FormGroup {
    return this.fb.group({
      type: [ticket?.type || '', Validators.required],
      price: [ticket?.price ?? '', [Validators.required, Validators.min(0)]],
      quantity: [ticket?.quantity ?? '', [Validators.required, Validators.min(1)]],
      benefits: [ticket?.benefits || []],
    });
  }


  addTicketType() {
    this.ticketsInfo.push(this.createTicketFormGroup());
  }

  removeTicketType(index: number) {
    if (this.ticketsInfo.length > 1) this.ticketsInfo.removeAt(index);
  }

  addBenefit(ticketIndex: number, input: HTMLInputElement) {
    const benefit = input.value.trim();
    if (benefit) {
      const ticket = this.ticketsInfo.at(ticketIndex) as FormGroup;
      const benefits = ticket.get('benefits')?.value || [];
      ticket.get('benefits')?.setValue([...benefits, benefit]);
      input.value = '';
    }
  }

  removeBenefit(ticketIndex: number, benefitIndex: number) {
    const ticket = this.ticketsInfo.at(ticketIndex) as FormGroup;
    const benefits = ticket.get('benefits')?.value || [];
    benefits.splice(benefitIndex, 1);
    ticket.get('benefits')?.setValue(benefits);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const reader = new FileReader();
      reader.onload = () => this.mediaInfo.get('mainImage')?.setValue(reader.result as string);
      reader.readAsDataURL(input.files[0]);
    }
  }

  onGalleryFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const galleryImages = this.mediaInfo.get('galleryImages') as FormArray;

    if (input.files?.length) {
      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => galleryImages.push(this.fb.control(reader.result as string));
        reader.readAsDataURL(file);
      });
    }
  }

  removeGalleryImage(index: number) {
    (this.mediaInfo.get('galleryImages') as FormArray).removeAt(index);
  }

  eventId: number = 0;
  addEvent(callback?: ()=> void){
    const createEventDto : CreateEventDto = {
      nom: this.eventForm.get('basicInfo.nom')?.value,
      description: this.eventForm.get('basicInfo.description')?.value,
      type: this.eventForm.get('basicInfo.type')?.value,
      date_debut: this.eventForm.get('dateInfo.date_debut')?.value,
      date_fin: this.eventForm.get('dateInfo.date_fin')?.value,
      lieu: this.eventForm.get('locationInfo.venue')?.value,
      image_url: this.eventForm.get('mediaInfo.mainImage')?.value,
    }

    this.eventService.createEvent(this.token || '', createEventDto).subscribe({
        next: (res)=>{
          this.snackBar.open('Événement créé avec succès!', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/admin/events/list']);
          this.eventId = res.id;
          if (callback) callback();
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de la création de l\'événement', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          console.error('Erreur lors de la création de l\'événement:', err);
        }
      })    
  }

  addBillet(){
    

    for (let i = 1; i < this.ticketsInfo.length; i++) {
      const billet: CreateTypeBilletDto = {
        libelle: this.ticketsInfo.at(0).get('type')?.value,
        prix: this.ticketsInfo.at(0).get('price')?.value,
        privileges: this.ticketsInfo.at(0).get('benefits')?.value,
        quantite: this.ticketsInfo.at(0).get('quantity')?.value,
        eventId: this.eventId 
      }

      this.billetService.createBillet(this.token || '', billet).subscribe({
        next: (res) => {
          console.log('Billet créé avec succès:', res);
        }, 
        error: (err) => {
          console.error('Erreur lors de la création du billet:', err);
        }
      })
    }

    


  }

  onSubmit() {
    // if (this.eventForm.invalid) {
    //   this.markFormGroupTouched(this.eventForm);
    //   return;
    // }

    this.isSubmitting = true;
    
    console.log('Event data:', this.eventForm.value);
    // console.log("token ",this.token);
    // console.log('Event data:', createEventDto);

    setTimeout(() => {
      this.isSubmitting = false;
      this.addEvent(()=> {
        this.addBillet();
      })
      
    }, 1500);
  }

  private markFormGroupTouched(group: FormGroup | FormArray) {
    Object.values(group.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getters
  get basicInfo() { return this.eventForm.get('basicInfo') as FormGroup; }
  get dateInfo() { return this.eventForm.get('dateInfo') as FormGroup; }
  get locationInfo() { return this.eventForm.get('locationInfo') as FormGroup; }
  get mediaInfo() { return this.eventForm.get('mediaInfo') as FormGroup; }
  get ticketsInfo() { return this.eventForm.get('ticketsInfo') as FormArray; }
}
