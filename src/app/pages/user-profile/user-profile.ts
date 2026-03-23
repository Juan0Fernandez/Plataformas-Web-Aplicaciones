import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { User } from '../../shared/models/user.model';
import { UserRole } from '../../shared/interfaces/role.interface';
import { updateProfile, updatePassword } from '@angular/fire/auth';
import { NavbarComponent, NavMenuItem } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  @ViewChild('photoInput') photoInput!: ElementRef<HTMLInputElement>;

  profileForm!: FormGroup;
  currentUser: any = null;
  userData: User | null = null;
  loading = true;
  saving = false;
  showPasswordChange = false;
  successMessage = '';
  errorMessage = '';
  selectedFile: File | null = null;
  navMenuItems: NavMenuItem[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private cloudinaryService: CloudinaryService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('🔵 UserProfile ngOnInit - Inicializando...');
    this.initializeForm();
    console.log('🔵 Formulario inicializado');

    // Intentar obtener el usuario actual primero (síncrono)
    const syncUser = this.authService.getCurrentUser();
    console.log('🔵 Usuario síncrono:', syncUser);

    if (syncUser) {
      this.currentUser = syncUser;
      await this.loadUserData();
    } else {
      // Si no hay usuario síncrono, esperar al observable
      console.log('🔵 No hay usuario síncrono, esperando observable...');
      this.authService.user$.subscribe(async (user) => {
        console.log('🔵 user$ emitió:', user);
        if (user) {
          this.currentUser = user;
          console.log('🔵 Usuario autenticado, cargando datos...');
          await this.loadUserData();
        } else {
          console.log('⚠️ No hay usuario, redirigiendo a login');
          this.loading = false;
          this.router.navigate(['/login']);
        }
      });
    }
  }

  /**
   * Inicializar el formulario con validadores
   */
  initializeForm(): void {
    this.profileForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      newPassword: [''],
      confirmPassword: ['']
    }, {
      validators: this.passwordMatchValidator
    });
  }

  /**
   * Validador personalizado para verificar que las contraseñas coincidan
   */
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (!newPassword || !confirmPassword) {
      return null;
    }

    // Si hay nueva contraseña, debe tener al menos 6 caracteres
    if (newPassword.value && newPassword.value.length < 6) {
      newPassword.setErrors({ minlength: true });
      return { minlength: true };
    }

    // Si hay contraseña, la confirmación debe coincidir
    if (newPassword.value && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    // Limpiar errores si todo está bien
    if (newPassword.value === confirmPassword.value) {
      confirmPassword.setErrors(null);
    }

    return null;
  }

  /**
   * Cargar datos del usuario actual
   */
  async loadUserData(): Promise<void> {
    try {
      console.log('🔵 loadUserData - Iniciando carga...');
      this.loading = true;

      if (this.currentUser) {
        console.log('🔵 Obteniendo datos de Firestore para UID:', this.currentUser.uid);
        this.userData = await this.userService.getUserByUid(this.currentUser.uid);
        console.log('🔵 Datos obtenidos de Firestore:', this.userData);

        // Poblar el formulario con los datos actuales
        this.profileForm.patchValue({
          displayName: this.currentUser.displayName || this.userData?.displayName || ''
        });
        console.log('🔵 Formulario poblado con displayName:', this.currentUser.displayName || this.userData?.displayName || '');
      }
      console.log('✅ loadUserData - Carga completada');
    } catch (error) {
      console.error('❌ Error cargando datos del usuario:', error);
      this.errorMessage = 'Error al cargar tus datos. Intenta de nuevo.';
    } finally {
      console.log('🔵 loadUserData - Estableciendo loading = false');
      this.loading = false;
      // Forzar detección de cambios
      this.cdr.detectChanges();
    }
  }

  /**
   * Toggle para mostrar/ocultar sección de cambio de contraseña
   */
  togglePasswordChange(): void {
    this.showPasswordChange = !this.showPasswordChange;

    // Limpiar campos de contraseña al cerrar
    if (!this.showPasswordChange) {
      this.profileForm.patchValue({
        newPassword: '',
        confirmPassword: ''
      });
    }
  }

  /**
   * Abrir diálogo de selección de foto
   */
  openPhotoUpload(): void {
    this.photoInput.nativeElement.click();
  }

  /**
   * Cuando se selecciona una foto
   */
  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Validar que sea una imagen válida
      if (!this.cloudinaryService.isValidImage(this.selectedFile)) {
        Swal.fire({
          title: 'Formato no válido',
          text: 'Por favor selecciona una imagen en formato JPG, PNG, GIF o WEBP',
          background: '#7c3aed',
          color: '#ffffff'
        });
        this.selectedFile = null;
        return;
      }

      // Validar tamaño (max 5MB)
      if (!this.cloudinaryService.isValidSize(this.selectedFile)) {
        Swal.fire({
          title: 'Imagen muy grande',
          text: 'La imagen no debe superar los 5MB',
          background: '#7c3aed',
          color: '#ffffff'
        });
        this.selectedFile = null;
        return;
      }

      // Subir la foto inmediatamente
      this.uploadPhoto();
    }
  }

  /**
   * Subir foto a Cloudinary
   */
  async uploadPhoto(): Promise<void> {
    if (!this.selectedFile || !this.currentUser) return;

    try {
      this.saving = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Mostrar indicador de carga
      Swal.fire({
        title: 'Subiendo imagen...',
        text: 'Por favor espera',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        background: '#7c3aed',
        color: '#ffffff'
      });

      // Subir a Cloudinary
      const photoURL = await this.cloudinaryService.uploadImage(this.selectedFile);

      // Actualizar perfil en Authentication
      await updateProfile(this.currentUser, { photoURL });

      // Actualizar en Firestore
      await this.userService.updateUserProfile(this.currentUser.uid, { photoURL });

      // Actualizar la vista
      this.currentUser.photoURL = photoURL;
      if (this.userData) {
        this.userData.photoURL = photoURL;
      }

      // Cerrar modal de carga y mostrar éxito
      Swal.fire({
        title: '¡Foto actualizada!',
        text: 'Tu foto de perfil se ha actualizado exitosamente',
        timer: 2000,
        background: '#7c3aed',
        color: '#ffffff'
      });

      this.successMessage = '¡Foto actualizada exitosamente!';
      setTimeout(() => this.successMessage = '', 3000);
    } catch (error) {
      console.error('Error subiendo foto:', error);

      Swal.fire({
        title: 'Error al subir',
        text: 'No se pudo subir la imagen. Intenta de nuevo.',
        background: '#7c3aed',
        color: '#ffffff'
      });

      this.errorMessage = 'Error al subir la foto. Intenta de nuevo.';
    } finally {
      this.saving = false;
      this.selectedFile = null;
    }
  }

  /**
   * Guardar cambios del perfil
   */
  async onSubmit(): Promise<void> {
    if (this.profileForm.invalid || !this.currentUser) return;

    try {
      this.saving = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.profileForm.value;

      // 1. Actualizar nombre si cambió
      if (formValue.displayName !== this.currentUser.displayName) {
        await updateProfile(this.currentUser, {
          displayName: formValue.displayName
        });

        await this.userService.updateUserProfile(this.currentUser.uid, {
          displayName: formValue.displayName
        });

        // Actualizar también userData si existe
        if (this.userData) {
          this.userData.displayName = formValue.displayName;
        }
      }

      // 2. Actualizar contraseña si se proporcionó
      if (formValue.newPassword && formValue.newPassword.length >= 6) {
        await updatePassword(this.currentUser, formValue.newPassword);

        // Limpiar campos de contraseña
        this.profileForm.patchValue({
          newPassword: '',
          confirmPassword: ''
        });
        this.showPasswordChange = false;
      }

      this.successMessage = '¡Perfil actualizado exitosamente!';
      setTimeout(() => this.successMessage = '', 3000);
    } catch (error: any) {
      console.error('Error actualizando perfil:', error);

      // Mensajes de error específicos
      if (error.code === 'auth/requires-recent-login') {
        this.errorMessage = 'Por seguridad, necesitas volver a iniciar sesión para cambiar tu contraseña.';
      } else {
        this.errorMessage = 'Error al actualizar el perfil. Intenta de nuevo.';
      }
    } finally {
      this.saving = false;
      this.cdr.detectChanges();
    }
  }

  /**
   * Obtener etiqueta del rol en español
   */
  getRoleLabel(role?: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrador';
      case UserRole.PROGRAMMER:
        return 'Programador';
      case UserRole.USER:
        return 'Usuario';
      default:
        return 'Usuario';
    }
  }

  /**
   * Formatear fecha a texto legible
   */
  formatDate(date: any): string {
    if (!date) return 'No disponible';

    let dateObj: Date;

    // Convertir Timestamp de Firestore a Date
    if (date.toDate && typeof date.toDate === 'function') {
      dateObj = date.toDate();
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      dateObj = new Date(date);
    }

    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Volver al dashboard o página anterior
   */
  goBack(): void {
    // Determinar a dónde volver según el rol
    if (this.userData?.role === UserRole.ADMIN) {
      this.router.navigate(['/admin']);
    } else if (this.userData?.role === UserRole.PROGRAMMER) {
      this.router.navigate(['/programmer']);
    } else {
      this.router.navigate(['/portfolio']);
    }
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
