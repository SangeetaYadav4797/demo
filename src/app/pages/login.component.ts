import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],   // ✅ Fixed
      password: ['', Validators.required]
    });
  }

  login() {
  if (this.loginForm.valid) {
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role || '');
          alert('Login successful!');
          this.router.navigate(['/dashboard']);
        } else {
          alert('Token not found in response!');
        }
      },
      error: (err) => {
        alert('Login failed: ' + (err.error?.message || 'Unknown error'));
      }
    });
  } else {
    alert('Please fill all fields');
  }
}


}
