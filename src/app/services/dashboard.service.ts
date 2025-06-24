import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}

 getDashboardStats() {
  return this.http.get<any>('https://localhost:7170/api/Dashboard/total-doctors');
}


}