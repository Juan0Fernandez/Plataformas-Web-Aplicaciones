import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProjectInfo {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  link: string;
  github?: string;
}

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-section.html',
  styleUrl: './projects-section.css',
})
export class ProjectsSection {
  @Input({ required: true }) projects!: ProjectInfo[];
}
