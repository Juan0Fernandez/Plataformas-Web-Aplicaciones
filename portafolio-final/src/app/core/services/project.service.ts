import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs, collectionData, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Project, ProjectType } from '../../shared/interfaces/project.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private firestore: Firestore = inject(Firestore);

  constructor() {}

  /**
   * Crear nuevo proyecto
   */
  async createProject(projectData: Omit<Project, 'id'>): Promise<string> {
    const data = {
      ...projectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const projectsRef = collection(this.firestore, 'projects');
    const docRef = await addDoc(projectsRef, data);
    return docRef.id;
  }

  /**
   * Obtener proyecto por ID
   */
  async getProjectById(projectId: string): Promise<Project | null> {
    const projectDoc = doc(this.firestore, 'projects', projectId);
    const docSnap = await getDoc(projectDoc);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Project;
    }
    return null;
  }

  /**
   * Obtener todos los proyectos de un programador
   */
  getProjectsByProgrammer(programmerId: string): Observable<Project[]> {
    return this.getAllProjects().pipe(
      map(projects => {
        const filtered = projects.filter(p => p.programmerId === programmerId);
        console.log('📋 Proyectos del programador:', filtered);
        return filtered;
      }),
      catchError(error => {
        console.error('❌ Error obteniendo proyectos del programador:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtener proyectos por tipo (académico o profesional)
   */
  getProjectsByType(programmerId: string, type: ProjectType): Observable<Project[]> {
    return this.getAllProjects().pipe(
      map(projects => {
        const filtered = projects.filter(p =>
          p.programmerId === programmerId &&
          p.type === type
        );
        console.log(`📋 Proyectos ${type} del programador:`, filtered);
        return filtered;
      }),
      catchError(error => {
        console.error('❌ Error obteniendo proyectos por tipo:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtener proyectos académicos
   */
  getAcademicProjects(programmerId: string): Observable<Project[]> {
    return this.getProjectsByType(programmerId, ProjectType.ACADEMIC);
  }

  /**
   * Obtener proyectos profesionales
   */
  getProfessionalProjects(programmerId: string): Observable<Project[]> {
    return this.getProjectsByType(programmerId, ProjectType.PROFESSIONAL);
  }

  /**
   * Actualizar proyecto
   */
  async updateProject(projectId: string, data: Partial<Project>): Promise<void> {
    const projectDoc = doc(this.firestore, 'projects', projectId);
    await updateDoc(projectDoc, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }

  /**
   * Eliminar proyecto
   */
  async deleteProject(projectId: string): Promise<void> {
    const projectDoc = doc(this.firestore, 'projects', projectId);
    await deleteDoc(projectDoc);
  }

  /**
   * Obtener todos los proyectos (admin)
   */
  getAllProjects(): Observable<Project[]> {
    const projectsRef = collection(this.firestore, 'projects');
    return from(getDocs(projectsRef)).pipe(
      map(snapshot => {
        const projects: Project[] = [];
        snapshot.forEach(doc => {
          projects.push({
            id: doc.id,
            ...doc.data()
          } as Project);
        });
        console.log('📦 getAllProjects: Proyectos obtenidos desde Firestore:', projects);
        return projects;
      }),
      catchError(error => {
        console.error('❌ getAllProjects: Error:', error);
        return of([]);
      })
    );
  }
}
