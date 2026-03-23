// Tipos de roles en el sistema
export enum UserRole {
  ADMIN = 'admin',
  PROGRAMMER = 'programmer',
  USER = 'user'  // Usuario normal que solo ve portafolios
}

// Interfaz para datos del usuario con rol
export interface UserWithRole {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}
