import { UserRole } from '../interfaces/role.interface';

export interface User {
  uid?: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role?: UserRole;  // admin, programmer, user
  createdAt?: Date;
  updatedAt?: Date;
}

// Para formularios de registro (incluye password)
export interface UserRegistration {
  email: string;
  password: string;
  name: string;
}