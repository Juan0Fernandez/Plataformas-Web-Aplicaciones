import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, user, updateProfile } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { User, UserRegistration } from '../../shared/models/user.model';
import { UserService } from './user.service';
import { UserRole } from '../../shared/interfaces/role.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private userService: UserService = inject(UserService);
  user$ = user(this.auth);
  currentUser: any = null;
  currentUserData: User | null = null;

  constructor() {
    this.user$.subscribe(async (aUser) => {
      this.currentUser = aUser;
      if (aUser) {
        // Obtener datos completos del usuario desde Firestore
        this.currentUserData = await this.userService.getUserByUid(aUser.uid);
      } else {
        this.currentUserData = null;
      }
    });
  }

  // Registro con email y contraseña
  async register(userData: UserRegistration): Promise<{ success: boolean; message: string }> {
    try {
      // Crear usuario en Firebase Authentication
      console.log('Creando usuario en Authentication...');
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        userData.password
      );
      console.log('Usuario creado en Authentication:', userCredential.user.uid);

      // Actualizar el perfil con el nombre
      if (userData.name && userCredential.user) {
        console.log('Actualizando perfil con nombre...');
        await updateProfile(userCredential.user, {
          displayName: userData.name
        });
      }

      // Crear documento en Firestore con rol USER por defecto
      try {
        console.log('Creando documento en Firestore...');
        await this.userService.createOrUpdateUser(userCredential.user.uid, {
          uid: userCredential.user.uid,
          email: userData.email,
          displayName: userData.name,
          role: UserRole.USER, // Por defecto es usuario normal
          photoURL: userCredential.user.photoURL || undefined
        });
        console.log('✅ Usuario creado en Firestore exitosamente');
      } catch (firestoreError) {
        console.error('❌ Error al crear documento en Firestore:', firestoreError);
        // El usuario ya está en Authentication, así que continuamos
      }

      return { success: true, message: '¡Registro exitoso!' };
    } catch (error: any) {
      console.error('❌ Error en registro:', error);
      return { success: false, message: this.getErrorMessage(error.code) };
    }
  }

  // Login con email y contraseña
  async login(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      return { success: true, message: 'Login exitoso' };
    } catch (error: any) {
      console.error('Error en login:', error);
      return { success: false, message: this.getErrorMessage(error.code) };
    }
  }

  // Login con Google
  async loginWithGoogle(): Promise<{ success: boolean; message: string }> {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(this.auth, provider);

      // Verificar si el usuario ya existe en Firestore
      const existingUser = await this.userService.getUserByUid(result.user.uid);

      if (!existingUser) {
        // Si es nuevo, crear con rol USER por defecto
        await this.userService.createOrUpdateUser(result.user.uid, {
          uid: result.user.uid,
          email: result.user.email!,
          displayName: result.user.displayName || undefined,
          photoURL: result.user.photoURL || undefined,
          role: UserRole.USER
        });
      }

      return { success: true, message: 'Login con Google exitoso' };
    } catch (error: any) {
      console.error('Error en login con Google:', error);
      return { success: false, message: this.getErrorMessage(error.code) };
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Error en logout:', error);
    }
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  // Obtener usuario actual
  getCurrentUser() {
    return this.currentUser;
  }

  // Obtener datos completos del usuario actual
  getCurrentUserData(): User | null {
    return this.currentUserData;
  }

  // Obtener rol del usuario actual
  async getCurrentUserRole(): Promise<UserRole | null> {
    if (this.currentUser) {
      return await this.userService.getUserRole(this.currentUser.uid);
    }
    return null;
  }

  // Verificar si el usuario actual es admin
  async isAdmin(): Promise<boolean> {
    if (this.currentUser) {
      return await this.userService.isAdmin(this.currentUser.uid);
    }
    return false;
  }

  // Verificar si el usuario actual es programador
  async isProgrammer(): Promise<boolean> {
    if (this.currentUser) {
      return await this.userService.isProgrammer(this.currentUser.uid);
    }
    return false;
  }

  // Mensajes de error en español
  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'Este email ya está registrado',
      'auth/invalid-email': 'Email inválido',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/user-disabled': 'Usuario deshabilitado',
      'auth/user-not-found': 'Vuelve a intentar. Verifica que tu correo o contraseña sean correctos',
      'auth/wrong-password': 'Vuelve a intentar. Verifica que tu correo o contraseña sean correctos',
      'auth/invalid-credential': 'Vuelve a intentar. Verifica que tu correo o contraseña sean correctos',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión',
      'auth/popup-closed-by-user': 'Ventana cerrada por el usuario',
      'auth/cancelled-popup-request': 'Solicitud cancelada'
    };

    return errorMessages[errorCode] || 'Error desconocido. Intenta de nuevo';
  }
}