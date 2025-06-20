import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../services/patient.service';
import { Patient } from './patient.model';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patientForm: FormGroup;
  isEdit: boolean = false;
  patientList: Patient[] = [];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService   // ✅ correctly injected
  ) {
    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      contact: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  // loadPatients(): void {
  //   this.patientService.getPatients().subscribe((data: Patient[]) => {
  //     console.log('Data from API:', data); 
  //     this.patientList = data;
  //   });
  // }

loadPatients(): void {
  this.patientService.getPatients().subscribe({
    next: (data: Patient[]) => {
      console.log('API response:', data); // 👀 Dekho yeh console mein aaraha hai ya nahi
      this.patientList = data;
    },
    error: (err) => {
      console.error('API error:', err); // 👀 Agar API call fail ho rahi ho to
    }
  });
}

  onSubmit(): void {
    if (this.patientForm.valid) {
      this.patientService.addPatient(this.patientForm.value).subscribe(() => {
        alert('Patient added successfully!');
        this.patientForm.reset();
        this.loadPatients(); //reload list after add
      });
    }
  }

  resetForm(): void {
    this.patientForm.reset();
    this.isEdit = false;
  }

  deletePatient(id: number): void {
    if (confirm('Are you sure you want to delete?')) {
      this.patientService.deletePatient(id).subscribe(() => {
        alert('Patient deleted');
        this.loadPatients();// reload after delete
      });
    }
  }
  editPatient(patient: Patient): void {
    this.patientForm.patchValue(patient);
    this.isEdit = true;
  }
}
