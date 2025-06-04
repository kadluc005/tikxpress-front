import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { ErrorInterceptorService } from './services/errorinterceptor.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true }
]
})
export class AppComponent {
  title = 'tikxpress';
}
