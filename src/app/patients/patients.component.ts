import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Patient } from './patient.model';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  @ViewChild('patientModal') patientModal!: ElementRef;

  patientForm!: FormGroup;
  isEdit: boolean = false;
  selectedPatientId: number = 0;
  patientList: Patient[] = [];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService
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

  openModal(): void {
    this.patientForm.reset();
    this.isEdit = false;
    this.patientModal.nativeElement.style.display = 'block';
  }

  closeModal(): void {
    this.patientForm.reset();
    this.isEdit = false;
    this.patientModal.nativeElement.style.display = 'none';
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: (data) => this.patientList = data,
      error: (err) => console.error('Error:', err)
    });
  }

  onSubmit(): void {
    if (this.patientForm.invalid) return;

    if (this.isEdit) {
      this.patientService.updatePatient(this.selectedPatientId, this.patientForm.value).subscribe(() => {
        alert('Patient updated!');
        this.closeModal();
        this.loadPatients();
      });
    } else {
      this.patientService.addPatient(this.patientForm.value).subscribe(() => {
        alert('Patient added!');
        this.closeModal();
        this.loadPatients();
      });
    }
  }

  deletePatient(id: number): void {
    if (confirm('Are you sure you want to delete?')) {
      this.patientService.deletePatient(id).subscribe(() => {
        alert('Patient deleted!');
        this.loadPatients();
      });
    }
  }

  editPatient(patient: Patient): void {
    this.selectedPatientId = patient.id!;
    this.patientForm.patchValue(patient);
    this.isEdit = true;
    this.patientModal.nativeElement.style.display = 'block';
  }
}
