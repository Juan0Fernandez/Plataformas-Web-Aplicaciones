import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core'; 
import { ListadoProyect } from './Componentes/listado-proyect/listado-proyect';

import { ProyectosService } from '../proyectos-dos-pages/services/proyecto-service'; 

interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-proyectos-page',
  standalone: true,
  imports: [ListadoProyect],
  templateUrl: './proyectospage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProyectosPage {
  private proyectosService = inject(ProyectosService); 

  name = signal('');
  description = signal('');

  public proyectos = this.proyectosService.proyectos; 

  changeName(value: string) {
    this.name.set(value);
  }

  changeDescription(value: string) {
    this.description.set(value);
  }

  addProyecto() {
    const newProyecto: Proyecto = {
      id: Math.floor(Math.random() * 10000), 
      nombre: this.name(),
      descripcion: this.description(),
    };
    
    this.proyectosService.addProyecto(newProyecto); 
    
    this.name.set('');
    this.description.set('');
  }

  eliminarProyecto() {
  throw new Error('Method not implemented.');
  } 



}