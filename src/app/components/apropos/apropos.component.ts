import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-apropos',
  imports: [RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './apropos.component.html',
  styleUrl: './apropos.component.scss'
})
export class AproposComponent {

}
