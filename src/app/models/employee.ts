export interface Employee {
  id: number;
  name: string;
  email: string;
  mobile: string;
  age: number;
  gender: string;
  countryId: number;
  stateId: number;
  cityId: number;
  salary: number;
  status: boolean;
  // Add these properties below:
  countryName?: string;  // Optional property
  stateName?: string;
  cityName?: string;
}
