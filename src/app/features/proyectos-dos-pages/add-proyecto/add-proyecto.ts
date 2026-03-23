import { ProyectosService } from '../services/proyecto-service'; 
import { ChangeDetectionStrategy, Component, signal, inject, output } from '@angular/core';
import { reqHandler } from '../../../../server';

interface Proyecto {
    id: number;
    nombre: string;
    descripcion: string;
}

@Component({
    selector: 'add-proyecto',
    standalone: true,
    imports: [],
    templateUrl: './add-proyecto.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProyecto {
   
    name = signal('');
    descripcion = signal('');

    newProyecto = output<Proyecto>(); 
    removeProyecto = output<number>();

    addProyecto() {
        const newProyecto: Proyecto = {
            id: Math.floor(Math.random() * 1000),
            nombre: this.name(),
            descripcion: this.descripcion(),
        };
        
        this.newProyecto.emit(newProyecto); 

        this.name.set('');
        this.descripcion.set('');
    }

    changeName(value: string) {
        this.name.set(value);
    }

    changeDescription(value: string) {
        this.descripcion.set(value);
    }

    dellProyecto(id: number) {
        this.removeProyecto.emit(id);
    }
}