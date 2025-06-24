import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Employee } from '../models/employee';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  @ViewChild('myModal') modal!: ElementRef;

  userRole: string = '';
  isLoggedIn: boolean = false;
  isEditMode: boolean = false; // ✅ Added to fix the error

  employeeList: Employee[] = [];
  employeeForm!: FormGroup;

  countries = [
    { id: 1, name: 'India' },
    { id: 2, name: 'USA' },
  ];

  states = [
    { id: 1, countryId: 1, name: 'Uttar Pradesh' },
    { id: 2, countryId: 1, name: 'Delhi' },
    { id: 3, countryId: 2, name: 'Texas' },
  ];

  cities = [
    { id: 1, stateId: 1, name: 'Lucknow' },
    { id: 2, stateId: 2, name: 'New Delhi' },
    { id: 3, stateId: 3, name: 'Houston' },
  ];

  filteredStates: any[] = [];
  filteredCities: any[] = [];
  genders = ['Male', 'Female'];

  constructor(
    private fb: FormBuilder,
    private empService: EmployeeService,
    private authService: AuthService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.setFormState();
    this.getEmployee();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openModel(isEdit: boolean = false): void {
    this.isEditMode = isEdit;
    this.employeeForm.reset({ id: 0, status: true });
    this.modal.nativeElement.style.display = 'block';
  }

  closeModel() {
    this.setFormState();
    this.isEditMode = false;
    if (this.modal) {
      this.modal.nativeElement.style.display = 'none';
    }
  }

  setFormState() {
    this.employeeForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      countryId: ['', Validators.required],
      stateId: ['', Validators.required],
      cityId: ['', Validators.required],
      salary: ['', Validators.required],
      status: ['Active', Validators.required]
    });

    this.filteredStates = [];
    this.filteredCities = [];
  }

  getEmployee() {
    this.empService.getEmployees().subscribe(
      (res) => {
        this.employeeList = res.map((emp: any) => ({
          ...emp,
          countryName: this.countries.find(c => c.id === emp.countryId)?.name || '',
          stateName: this.states.find(s => s.id === emp.stateId)?.name || '',
          cityName: this.cities.find(c => c.id === emp.cityId)?.name || '',
          status: emp.status === 'Active' ? 'Active' : 'Inactive'
        }));
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  onSubmit() {
    if (this.employeeForm.invalid) {
      alert('Please fill all required fields.');
      return;
    }

    const formData = this.employeeForm.value;

    if (this.isEditMode) {
      this.empService.updateEmployee(formData).subscribe(() => {
        alert('Employee Updated Successfully');
        this.getEmployee();
        this.closeModel();
      });
    } else {
      this.empService.addEmployee(formData).subscribe(() => {
        alert('Employee Added Successfully');
        this.getEmployee();
        this.closeModel();
      });
    }

    this.employeeForm.reset();
    this.employeeForm.patchValue({ status: 'Active' });
    this.isEditMode = false;
  }

  onEdit(employee: Employee) {
    this.employeeForm.patchValue(employee);
    this.filteredStates = this.states.filter(s => s.countryId === employee.countryId);
    this.filteredCities = this.cities.filter(c => c.stateId === employee.stateId);
    this.openModel(true);
  }

  onDelete(id: number) {
    if (confirm("Are you sure you want to delete this Employee?")) {
      this.empService.deleteEmployee(id).subscribe(() => {
        alert("Employee Deleted Successfully");
        this.getEmployee();
      });
    }
  }

  toggleStatus() {
    const currentStatus = this.employeeForm.value.status;
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

    const updatedEmployee = {
      ...this.employeeForm.value,
      status: newStatus
    };

    this.empService.updateEmployee(updatedEmployee).subscribe(() => {
      alert(`Employee ${newStatus === 'Active' ? 'enabled' : 'disabled'} successfully.`);
      this.getEmployee();
      this.closeModel();
    });
  }

  onCountryChange(event: Event): void {
    const selectedCountryId = +(event.target as HTMLSelectElement).value;
    this.filteredStates = this.states.filter(s => s.countryId === selectedCountryId);
    this.filteredCities = [];
    this.employeeForm.get('stateId')?.setValue('');
    this.employeeForm.get('cityId')?.setValue('');
  }

  onStateChange(event: Event): void {
    const selectedStateId = +(event.target as HTMLSelectElement).value;
    this.filteredCities = this.cities.filter(c => c.stateId === selectedStateId);
    this.employeeForm.get('cityId')?.setValue('');
  }

  trackByEmpId(index: number, emp: any): number {
    return emp.id;
  }
}

