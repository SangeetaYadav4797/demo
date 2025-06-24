import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Doctor } from './doctor.model';
import { DoctorService } from '../services/doctor.service';

@Component({
  standalone: true,
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class DoctorsComponent implements OnInit {
  @ViewChild('doctorModal') doctorModal!: ElementRef;

  doctors: Doctor[] = [];
  doctorForm!: FormGroup;
  isEditMode: boolean = false;
  selectedDoctorId: number = 0;

  constructor(private doctorService: DoctorService, private fb: FormBuilder) {
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

  openModal(): void {
    this.doctorForm.reset();
    this.isEditMode = false;
    this.doctorModal.nativeElement.style.display = 'block';
  }

  closeModal(): void {
    this.doctorForm.reset();
    this.isEditMode = false;
    this.doctorModal.nativeElement.style.display = 'none';
  }

  getDoctorList(): void {
    this.doctorService.getAllDoctors().subscribe((data) => {
      this.doctors = data;
    });
  }

  onSubmit(): void {
    if (this.doctorForm.invalid) return;

    if (this.isEditMode) {
      this.doctorService.updateDoctor(this.selectedDoctorId, this.doctorForm.value).subscribe(() => {
        this.getDoctorList();
        this.closeModal();
      });
    } else {
      this.doctorService.addDoctor(this.doctorForm.value).subscribe(() => {
        this.getDoctorList();
        this.closeModal();
      });
    }
  }

  editDoctor(doc: Doctor): void {
    this.selectedDoctorId = doc.id!;
    this.doctorForm.patchValue(doc);
    this.isEditMode = true;
    this.doctorModal.nativeElement.style.display = 'block';
  }

  deleteDoctor(id: number): void {
    if (confirm("Are you sure to delete this doctor?")) {
      this.doctorService.deleteDoctor(id).subscribe(() => {
        this.getDoctorList();
        alert("Doctor deleted successfully");
      });
    }
  }
}
