import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SkillInfo {
  name: string;
  level: number;
  icon: string;
}

@Component({
  selector: 'app-skills-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills-section.html',
  styleUrl: './skills-section.css',
})
export class SkillsSection {
  @Input({ required: true }) skills!: SkillInfo[];
}
