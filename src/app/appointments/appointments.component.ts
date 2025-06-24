import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Appointment } from '../models/appointment.model';
import { AppointmentService } from '../services/appointment.service';

@Component({
  standalone: true,
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  appointmentForm!: FormGroup;
  isEditMode = false;
  selectedId = 0;

  @ViewChild('appointmentModal') appointmentModal!: ElementRef;

  constructor(private fb: FormBuilder, private service: AppointmentService) {}

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      patientName: ['', Validators.required],
      doctorName: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      reason: [''],
      status: ['Scheduled', Validators.required],
    });

    this.loadAppointments();
  }

  // ✅ Get all appointments
  loadAppointments() {
    this.service.getAll().subscribe({
      next: (res) => this.appointments = res,
      error: (err) => console.error('Error fetching appointments:', err)
    });
  }

  // ✅ Open Modal
  openModal() {
    (this.appointmentModal.nativeElement as HTMLDivElement).style.display = 'block';
  }

  // ✅ Close Modal
  closeModal() {
    (this.appointmentModal.nativeElement as HTMLDivElement).style.display = 'none';
    this.resetForm();
  }

  // ✅ Add or Update
  submit() {
    if (this.isEditMode) {
      this.service.update(this.selectedId, this.appointmentForm.value).subscribe(() => {
        this.loadAppointments();
        this.closeModal();
      });
    } else {
      this.service.add(this.appointmentForm.value).subscribe(() => {
        this.loadAppointments();
        this.closeModal();
      });
    }
  }

  // ✅ Edit
  edit(appt: Appointment) {
    this.appointmentForm.patchValue(appt);
    this.selectedId = appt.id!;
    this.isEditMode = true;
    this.openModal();
  }

  // ✅ Delete
  delete(id: number) {
    if (confirm('Are you sure?')) {
      this.service.delete(id).subscribe(() => this.loadAppointments());
    }
  }

  // ✅ Reset
  resetForm() {
    this.appointmentForm.reset();
    this.isEditMode = false;
    this.selectedId = 0;
  }
}
