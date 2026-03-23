import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DeveloperInfo {
  name: string;
  title: string;
  greeting: string;
  bio: string;
  description: string;
  image: string;
  github: string;
  linkedin: string;
  email?: string;
  whatsapp?: string;
}

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css'
})
export class HeroSectionComponent {
  @Input({ required: true }) developer!: DeveloperInfo;
  @Output() contactClick = new EventEmitter<void>();

  onContactClick(): void {
    this.contactClick.emit();
  }
}
