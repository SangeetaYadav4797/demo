import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ IMPORT THIS
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule], // ✅ ADD CommonModule HERE
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
