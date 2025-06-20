import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Doctor } from './doctor.model';
import { DoctorService } from '../services/doctor.service';// ✅ Yaha DoctorService import kiya

@Component({
  standalone: true,
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class DoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  doctorForm: FormGroup;
  isEditMode = false;
  selectedDoctorId: number = 0;

  constructor(private doctorService: DoctorService, private fb: FormBuilder) {  // ✅ DoctorService yaha inject kiya
    this.doctorForm = this.fb.group({
      name: ['', Validators.required],
      specialization: ['', Validators.required],
      experience: [0, Validators.required],
      contact: ['', Validators.required],
    });
  }

 ngOnInit(): void {
  this.getDoctorList();
}

getDoctorList(): void {
  this.doctorService.getAllDoctors().subscribe({
    next: (data: Doctor[]) => {
      console.log('Doctor data:', data);
      this.doctors = data;
    },
    error: (err) => {
      console.error('API Error:', err);
    }
  });
}



  onSubmit(): void {
    if (this.isEditMode) {
      this.doctorService.updateDoctor(this.selectedDoctorId, this.doctorForm.value).subscribe(() => {
        this.getDoctorList();
        this.resetForm();
      });
    } else {
      this.doctorService.addDoctor(this.doctorForm.value).subscribe(() => {
        this.getDoctorList();
        this.resetForm();
      });
    }
  }

  editDoctor(doc: Doctor): void {
    this.isEditMode = true;
    this.selectedDoctorId = doc.id!;
    this.doctorForm.patchValue(doc);
  }

  deleteDoctor(id: number): void {
    this.doctorService.deleteDoctor(id).subscribe(() => {
      this.getDoctorList();
      alert('Doctor deleted successfully');
    });
  }

  resetForm(): void {
    this.doctorForm.reset();
    this.isEditMode = false;
    this.selectedDoctorId = 0;
  }
}
