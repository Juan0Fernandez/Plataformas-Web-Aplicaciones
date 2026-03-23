// src/app/app.ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './share/component/nav-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  // ASEGÚRATE que NavBar esté bien escrito y la clase se exporte correctamente.
  imports: [RouterOutlet, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('mi-app-angular');
}