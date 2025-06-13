import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeComponent } from './employee/employee.component';

@NgModule({
  declarations: [
    EmployeeComponent,
    // baaki components agar hain to yahan add karo
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule  // Ye zaroori hai form ke liye
  ],
  bootstrap: [EmployeeComponent]
})
export class AppModule { }
