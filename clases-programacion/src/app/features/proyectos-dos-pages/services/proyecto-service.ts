import { effect, Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // <-- Necesaria para chequear el entorno

interface Proyecto {
 id: number;
 nombre: string;
  descripcion: string;
}

@Injectable({
 providedIn: 'root'
})
export class ProyectosService {
    
    private readonly STORAGE_KEY = 'proyectosApp';
    private platformId = inject(PLATFORM_ID); // <-- Inyección necesaria para chequear el entorno
 /*
     public proyectos = signal<Proyecto[]>([
        {
            id: 1,
            nombre: 'Proyecta A',
            descripcion: 'descripcion'
        }
    ]);*/ 
    
  proyectos = signal<Proyecto[]>(this.loadProyectos());

 constructor() {
       if (isPlatformBrowser(this.platformId)) {
         effect(()=>{
            const data = this.proyectos(); 
            console.log(data);
            console.log(JSON.stringify(data));
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        });
    }
 }
 
 private loadProyectos() : Proyecto[]  
 {
        // SOLUCIÓN AL ERROR DE LOCALSTORAGE: SOLO accede a localStorage en el navegador
        if (isPlatformBrowser(this.platformId)) {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [{
                id: 1 , nombre:"Proyecto A",
                descripcion: "Descripcion"
            }]
        }
        
        // Si no es el navegador (SSR), devuelve el valor por defecto
        return [{
            id: 1 , nombre:"Proyecto A",
            descripcion: "Descripcion"
        }]
 }

 addProyecto(newProyecto: Proyecto) {
 this.proyectos.set([...this.proyectos(), newProyecto]);
 }
 removeFirstProyecto() {
 this.proyectos.set(this.proyectos().slice(1));
 }
}