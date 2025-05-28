import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
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
import { MapComponent } from '../map/map.component';


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
    MatCheckboxModule,
    MapComponent
  ],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements AfterViewInit{
  eventForm: FormGroup;
  isSubmitting = false;
  minDate = new Date();
  completedSteps = [false, false, false, false, false];
  token : string = localStorage.getItem('token') || '';
  selectedFile: File | null = null;
  
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

  ngAfterViewInit(): void {
    this.latitude = this.location.getCoordinates().latitude;
    this.longitude = this.location.getCoordinates().longitude;
    setTimeout(()=>{
      const coords = this.location.getCoordinates();
      this.longitude = coords.longitude;
      this.latitude = coords.latitude;
      console.log('Coordonnées récupérées :', this.latitude, this.longitude);
    },0);
    
  }

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
      }),
      mediaInfo: this.fb.group({
        mainImage: ['',],
        galleryImages: this.fb.array([])
      }),
      ticketsInfo: this.fb.array([this.createTicketFormGroup()])
    });
  }

  

  private dateValidator(group: FormGroup) {
    const start = group.get('date_debut')?.value;
    const end = group.get('date_fin')?.value;
    return (start && end && new Date(start) > new Date(end)) ? { dateRange: true } : null;
  }
  createTicketFormGroup(ticket?: CreateTypeBilletDto): FormGroup {
    return this.fb.group({
      type: [ticket?.libelle || '', Validators.required],
      price: [ticket?.prix ?? '', [Validators.required, Validators.min(0)]],
      quantity: [ticket?.quantite ?? '', [Validators.required, Validators.min(1)]],
      benefits: [ticket?.privileges || []],
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
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.mediaInfo.get('mainImage')?.setValue(reader.result as string);
      };
      reader.readAsDataURL(file);
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
  addEventR(callback?: ()=> void){
    const createEventDto : CreateEventDto = {
      nom: this.eventForm.get('basicInfo.nom')?.value,
      description: this.eventForm.get('basicInfo.description')?.value,
      type: this.eventForm.get('basicInfo.type')?.value,
      date_debut: this.eventForm.get('dateInfo.date_debut')?.value,
      date_fin: this.eventForm.get('dateInfo.date_fin')?.value,
      lieu: this.eventForm.get('locationInfo.venue')?.value,
      latitude: this.latitude ?? 0,
      longitude: this.longitude ?? 0,
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
  addEvent(callback?: () => void) {
    const formData = new FormData();
    
    // Champ fichier (attention au nom "image")
    if (this.selectedFile) {
      formData.append('image', this.selectedFile); // Le nom "image" est crucial
    }

    // Champs du DTO
    formData.append('nom', this.basicInfo.get('nom')?.value);
    formData.append('description', this.basicInfo.get('description')?.value);
    formData.append('type', this.basicInfo.get('type')?.value);
    formData.append('date_debut', this.dateInfo.get('date_debut')?.value);
    formData.append('date_fin', this.dateInfo.get('date_fin')?.value);
    formData.append('lieu', this.locationInfo.get('venue')?.value);
    formData.append('latitude', this.latitude?.toString() || '0');
    formData.append('longitude', this.longitude?.toString() || '0');

    // Appel API avec FormData
    this.eventService.createEventFormData(this.token || '', formData).subscribe({
      next: (res) => {
        this.snackBar.open('Événement créé avec succès!', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        this.router.navigate(['/admin/events/list']);
        this.eventId = res.id;
        if (callback) callback();
      },
      error: (err) => {
        this.snackBar.open("Erreur lors de la création de l'événement", 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        console.error("Erreur lors de la création de l'événement:", err);
      },
    });
  }


  addBillet(){
    for (let i = 0; i < this.ticketsInfo.length; i++) {
      const billet: CreateTypeBilletDto = {
        libelle: this.ticketsInfo.at(i).get('type')?.value,
        prix: this.ticketsInfo.at(i).get('price')?.value,
        privileges: this.ticketsInfo.at(i).get('benefits')?.value,
        quantite: this.ticketsInfo.at(i).get('quantity')?.value,
        eventId: this.eventId 
      }

      this.billetService.createBillet(this.token || '', billet).subscribe({
        next: (res) => {
        console.log(`Billet ${i + 1} créé avec succès:`, res);
      },
      error: (err) => {
        console.error(`Erreur création billet ${i + 1}:`, err);
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
