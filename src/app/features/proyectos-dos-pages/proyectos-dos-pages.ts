import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProyectosService } from './services/proyecto-service'; 
import { ListadoProyect } from '../proyectospage/Componentes/listado-proyect/listado-proyect'
import { AddProyecto } from './add-proyecto/add-proyecto'; 

@Component({
  selector: 'app-proyecto-dos-page',
  standalone: true,
  imports: [ListadoProyect, AddProyecto], 
  templateUrl: './proyectos-dos-pages.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProyectoDosPage {
  public proyectosService = inject(ProyectosService);
  
  proyectos = this.proyectosService.proyectos; 
  
  handleNewProyecto(newProyecto: any) {
    this.proyectosService.addProyecto(newProyecto);
  }
}