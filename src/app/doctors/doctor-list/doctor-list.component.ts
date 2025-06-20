import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Doctor } from '../doctor.model';
import { DoctorService } from '../../services/doctor.service';

@Component({
  standalone: true,
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css'],
  imports: [CommonModule]
})
export class DoctorListComponent implements OnInit {
  doctors: Doctor[] = [];

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getAllDoctors().subscribe({
      next: (data: Doctor[]) => {
        this.doctors = data;
      },
      error: (err: any) => {
        console.error('Failed to load doctors:', err);
      }
    });
  }
}
