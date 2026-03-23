import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs, collectionData, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Schedule } from '../../shared/interfaces/advisory.interface';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private firestore: Firestore = inject(Firestore);

  constructor() {}

  /**
   * Crear nuevo horario
   */
  async createSchedule(scheduleData: Omit<Schedule, 'id'>): Promise<string> {
    const data = {
      ...scheduleData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const schedulesRef = collection(this.firestore, 'schedules');
    const docRef = await addDoc(schedulesRef, data);
    return docRef.id;
  }

  /**
   * Obtener horarios de un programador
   */
  getSchedulesByProgrammer(programmerId: string): Observable<Schedule[]> {
    return this.getAllSchedules().pipe(
      map(schedules => {
        const filtered = schedules.filter(s => s.programmerId === programmerId);
        console.log('📋 Horarios del programador:', filtered);
        return filtered;
      }),
      catchError(error => {
        console.error('❌ Error obteniendo horarios del programador:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtener horarios activos de un programador
   */
  getActiveSchedules(programmerId: string): Observable<Schedule[]> {
    return this.getAllSchedules().pipe(
      map(schedules => {
        const filtered = schedules.filter(s =>
          s.programmerId === programmerId &&
          s.isActive === true
        );
        console.log('📋 Horarios activos del programador:', filtered);
        return filtered;
      }),
      catchError(error => {
        console.error('❌ Error obteniendo horarios activos:', error);
        return of([]);
      })
    );
  }

  /**
   * Actualizar horario
   */
  async updateSchedule(scheduleId: string, data: Partial<Schedule>): Promise<void> {
    const scheduleDoc = doc(this.firestore, 'schedules', scheduleId);
    await updateDoc(scheduleDoc, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }

  /**
   * Activar/Desactivar horario
   */
  async toggleSchedule(scheduleId: string, isActive: boolean): Promise<void> {
    const scheduleDoc = doc(this.firestore, 'schedules', scheduleId);
    await updateDoc(scheduleDoc, {
      isActive,
      updatedAt: serverTimestamp()
    });
  }

  /**
   * Eliminar horario
   */
  async deleteSchedule(scheduleId: string): Promise<void> {
    const scheduleDoc = doc(this.firestore, 'schedules', scheduleId);
    await deleteDoc(scheduleDoc);
  }

  /**
   * Obtener todos los horarios (admin)
   */
  getAllSchedules(): Observable<Schedule[]> {
    const schedulesRef = collection(this.firestore, 'schedules');
    return from(getDocs(schedulesRef)).pipe(
      map(snapshot => {
        const schedules: Schedule[] = [];
        snapshot.forEach(doc => {
          schedules.push({
            id: doc.id,
            ...doc.data()
          } as Schedule);
        });
        console.log('📦 getAllSchedules: Horarios obtenidos desde Firestore:', schedules);
        return schedules;
      }),
      catchError(error => {
        console.error('❌ getAllSchedules: Error:', error);
        return of([]);
      })
    );
  }
}
