import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagenotfound',
  imports: [RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './pagenotfound.component.html',
  styleUrl: './pagenotfound.component.scss', 
})
export class PagenotfoundComponent {

}
