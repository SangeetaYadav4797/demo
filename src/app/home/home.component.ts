import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // ✅ Dono import

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) {} // ✅ Router inject karo

  goToLogin() {
    this.router.navigate(['/login']); // ✅ Navigate on Access System
  }

  goToAbout() {
    this.router.navigate(['/about']); // ✅ Navigate on Learn More
  }
}
