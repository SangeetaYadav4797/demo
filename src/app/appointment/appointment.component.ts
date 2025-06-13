import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-appointment',
  standalone: true,   // ✅ agar standalone use kar rahe ho
  imports: [CommonModule, RouterModule],  // ✅ zaroori hai agar routerLink use kar rahe ho
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent {}


