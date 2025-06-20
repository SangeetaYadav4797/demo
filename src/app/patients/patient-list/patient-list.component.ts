import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Patient } from '../patient.model';
import { CommonModule } from '@angular/common';

@Component({
   standalone: true,
  selector: 'app-patient-list',
  imports: [CommonModule],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent {
  @Input() patients: Patient[] = [];
  @Output() edit = new EventEmitter<Patient>();
  @Output() delete = new EventEmitter<number>();

  editPatient(patient: Patient) {
    this.edit.emit(patient);
  }

  deletePatient(id: number) {
    this.delete.emit(id);
  }
}
