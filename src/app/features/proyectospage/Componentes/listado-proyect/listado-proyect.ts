// src/app/features/proyectospage/Componentes/listado-proyecto/listado-proyect/listado-proyect.ts

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

// Definición completa de la interfaz Proyecto para evitar errores de compilación
interface Proyecto { 
    id: number; 
    nombre: string;
    descripcion: string; 
}

@Component({
  selector: 'listado-proyect',
  imports: [], 
  templateUrl: './listado-proyect.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true 
})

export class ListadoProyect{ 
  listaName = input.required<string>();
  
  // Usando la interfaz completa
  proyectosList = input.required<Proyecto[]>();
}