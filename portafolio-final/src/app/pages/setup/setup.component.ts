import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { User } from '../../shared/models/user.model';
import { UserRole } from '../../shared/interfaces/role.interface';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div class="max-w-4xl mx-auto px-4">
        <div class="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-white/10 p-8">
          <h1 class="text-3xl font-bold text-white mb-4">🛠️ Configuración de Usuarios</h1>
          <p class="text-gray-400 mb-8">Asigna roles a los usuarios existentes en Firebase Authentication</p>

          <!-- Loading -->
          <div *ngIf="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p class="text-white mt-4">Cargando usuarios...</p>
          </div>

          <!-- Users List -->
          <div *ngIf="!loading" class="space-y-4">
            <div *ngFor="let user of users" class="bg-slate-900/50 rounded-lg p-6 border border-white/10">
              <div class="flex items-center justify-between flex-wrap gap-4">
                <div class="flex items-center gap-4">
                  <img
                    [src]="user.photoURL || 'https://ui-avatars.com/api/?name=' + (user.displayName || user.email)"
                    [alt]="user.displayName || 'Usuario'"
                    class="h-16 w-16 rounded-full border-2 border-purple-500/50">
                  <div>
                    <h3 class="text-lg font-bold text-white">{{ user.displayName || 'Sin nombre' }}</h3>
                    <p class="text-sm text-gray-400">{{ user.email }}</p>
                    <p class="text-xs text-gray-500 mt-1">UID: {{ user.uid?.substring(0, 12) }}...</p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <span [class]="'px-3 py-1 rounded-full text-sm font-semibold ' + getRoleBadgeColor(user.role)">
                    {{ getRoleLabel(user.role) }}
                  </span>
                  <select
                    [(ngModel)]="user.role"
                    (change)="updateRole(user)"
                    class="bg-slate-700 text-white px-4 py-2 rounded-lg border border-white/10">
                    <option [value]="UserRole.USER">Usuario</option>
                    <option [value]="UserRole.PROGRAMMER">Programador</option>
                    <option [value]="UserRole.ADMIN">Admin</option>
                  </select>
                </div>
              </div>

              <div *ngIf="user.role === UserRole.PROGRAMMER" class="mt-4 p-3 bg-purple-600/10 border border-purple-600/30 rounded-lg">
                <p class="text-sm text-purple-300">
                  ✓ Este usuario puede recibir solicitudes de asesoría
                </p>
              </div>

              <div *ngIf="user.role === UserRole.ADMIN" class="mt-4 p-3 bg-red-600/10 border border-red-600/30 rounded-lg">
                <p class="text-sm text-red-300">
                  ✓ Este usuario puede gestionar todos los usuarios y horarios
                </p>
              </div>
            </div>

            <div *ngIf="users.length === 0" class="text-center py-12">
              <p class="text-gray-400">No hay usuarios registrados</p>
            </div>
          </div>

          <!-- Instructions -->
          <div class="mt-8 p-6 bg-blue-600/10 border border-blue-600/30 rounded-lg">
            <h3 class="text-white font-bold mb-2">📝 Instrucciones:</h3>
            <ol class="text-sm text-blue-300 space-y-2 list-decimal list-inside">
              <li>Asigna el rol "Programador" a los usuarios que recibirán solicitudes de asesoría</li>
              <li>Asigna el rol "Admin" al usuario que gestionará el sistema</li>
              <li>Los demás usuarios mantendrán el rol "Usuario" por defecto</li>
              <li>Después de configurar, ve a <strong>/login</strong> para iniciar sesión</li>
            </ol>
          </div>

          <!-- Success Message -->
          <div *ngIf="successMessage" class="mt-4 p-4 bg-green-600/10 border border-green-600/30 rounded-lg">
            <p class="text-green-400">{{ successMessage }}</p>
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="mt-4 p-4 bg-red-600/10 border border-red-600/30 rounded-lg">
            <p class="text-red-400">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SetupComponent implements OnInit {
  users: User[] = [];
  loading = true;
  successMessage = '';
  errorMessage = '';
  UserRole = UserRole;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando usuarios:', error);
        this.errorMessage = 'Error al cargar usuarios. Verifica la consola.';
        this.loading = false;
      }
    });
  }

  async updateRole(user: User): Promise<void> {
    try {
      await this.userService.assignRole(user.uid!, user.role!);
      this.successMessage = `Rol actualizado para ${user.displayName || user.email}`;
      setTimeout(() => this.successMessage = '', 3000);
    } catch (error) {
      console.error('Error actualizando rol:', error);
      this.errorMessage = 'Error al actualizar el rol';
      setTimeout(() => this.errorMessage = '', 3000);
    }
  }

  getRoleBadgeColor(role?: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-600 text-white';
      case UserRole.PROGRAMMER:
        return 'bg-purple-600 text-white';
      case UserRole.USER:
        return 'bg-blue-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  }

  getRoleLabel(role?: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrador';
      case UserRole.PROGRAMMER:
        return 'Programador';
      case UserRole.USER:
        return 'Usuario';
      default:
        return 'Sin rol';
    }
  }
}
