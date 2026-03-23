import { Component, EventEmitter, Input, Output, HostListener, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../interfaces/notification.interface';
import { Subscription } from 'rxjs';

export interface NavMenuItem {
  label: string;
  icon: string;
  action: () => void;
}

export interface NavLink {
  label: string;
  sectionId: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink,],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() currentUser: any = null;
  @Input() showDashboardLink: boolean = false;
  @Input() additionalMenuItems: NavMenuItem[] = [];
  @Input() customNavLinks: NavLink[] = [];
  @Input() hideNavLinks: boolean = false; // Oculta los enlaces de navegación en dashboards
  @Output() logoutEvent = new EventEmitter<void>();
  @Output() scrollToEvent = new EventEmitter<string>();

  // Enlaces de navegación por defecto 
  defaultNavLinks: NavLink[] = [
    { label: 'Inicio', sectionId: 'home' },
    { label: 'Características', sectionId: 'about' },
    { label: 'Habilidades', sectionId: 'skills' },
    { label: 'Contacto', sectionId: 'contact' }
  ];

  // Propiedad computada para los enlaces a mostrar
  get navLinks(): NavLink[] {
    return this.customNavLinks.length > 0 ? this.customNavLinks : this.defaultNavLinks;
  }

  menuOpen = false;
  userMenuOpen = false;
  notificationsMenuOpen = false;
  notifications: Notification[] = [];
  unreadCount = 0;
  private notificationSubscription?: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Cargar notificaciones cuando el usuario esté disponible
    if (this.currentUser?.uid) {
      this.loadNotifications();
    }
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  ngOnChanges(): void {
    // Recargar notificaciones si cambia el usuario
    if (this.currentUser?.uid) {
      this.loadNotifications();
    }
  }

  loadNotifications(): void {
    if (!this.currentUser?.uid) return;

    this.notificationSubscription = this.notificationService
      .getUserNotifications(this.currentUser.uid)
      .subscribe(notifications => {
        this.notifications = notifications.slice(0, 5); // Mostrar solo las 5 
        this.unreadCount = notifications.filter(n => !n.read).length;
      });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu(): void {
    this.userMenuOpen = false;
  }

  logout(): void {
    this.logoutEvent.emit();
    this.closeUserMenu();
  }

  scrollToSection(sectionId: string): void {
    this.scrollToEvent.emit(sectionId);
    this.menuOpen = false;
  }

  getUserInitials(): string {
    if (!this.currentUser) return '?';
    const name = this.currentUser.displayName || this.currentUser.name || this.currentUser.email;
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getUserDisplayName(): string {
    return this.currentUser?.displayName || this.currentUser?.name || 'Usuario';
  }

  getUserEmail(): string {
    return this.currentUser?.email || '';
  }

  toggleNotificationsMenu(): void {
    this.notificationsMenuOpen = !this.notificationsMenuOpen;
    if (this.notificationsMenuOpen) {
      this.userMenuOpen = false;
    }
  }

  closeNotificationsMenu(): void {
    this.notificationsMenuOpen = false;
  }

  async markAsRead(notification: Notification): Promise<void> {
    if (notification.id && !notification.read) {
      await this.notificationService.markAsRead(notification.id);
      this.loadNotifications();
    }
  }

  async markAllAsRead(): Promise<void> {
    if (this.currentUser?.uid) {
      await this.notificationService.markAllAsRead(this.currentUser.uid);
      this.loadNotifications();
    }
  }

  getNotificationIcon(notification: Notification): string {
    return this.notificationService.getNotificationIcon(notification.type);
  }

  getNotificationColor(notification: Notification): string {
    return this.notificationService.getNotificationColor(notification.type);
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 1) return 'Justo ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays}d`;

    return new Date(date).toLocaleDateString();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInsideUser = target.closest('.user-menu-container');
    const clickedInsideNotifications = target.closest('.notifications-menu-container');

    if (!clickedInsideUser && this.userMenuOpen) {
      this.userMenuOpen = false;
    }

    if (!clickedInsideNotifications && this.notificationsMenuOpen) {
      this.notificationsMenuOpen = false;
    }
  }
}