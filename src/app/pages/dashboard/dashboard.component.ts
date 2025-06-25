import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service'; // path adjust karo as per location
import { Chart, ChartData, registerables } from 'chart.js';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../doctors/doctor.model';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  totalDoctors = 0;
  totalPatients = 0;
  appointmentsToday = 0;

  chartOptions = { responsive: true };
  doctors: Doctor[]=[];

  constructor(private dashboardService: DashboardService,private doctorService:DoctorService ) {}

ngOnInit(): void {
  this.dashboardService.getDashboardStats().subscribe(res => {
    console.log('Dashboard API response:', res); 
    this.totalDoctors = res.totalDoctors;         
    this.totalPatients = res.totalPatients;       
    this.appointmentsToday = res.appointmentsToday; 
    this.loadDoctors();
  });
}

loadDoctors(): void {
    this.doctorService.getAllDoctors().subscribe({
      next: (data: Doctor[]) => {
        this.doctors = data;
        console.log('doctors',this.doctors)
      },
      error: (err: any) => {
        console.error('Failed to load doctors:', err);
      }
    });
  }

}