import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs, collectionData, serverTimestamp } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../../shared/models/user.model';
import { UserRole } from '../../shared/interfaces/role.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore: Firestore = inject(Firestore);

  constructor() {}

  /**
   * Crear o actualizar usuario en Firestore con su rol
   */
  async createOrUpdateUser(uid: string, userData: Partial<User>): Promise<void> {
    try {
      const userDoc = doc(this.firestore, 'users', uid);

      // Verificar si el documento ya existe
      const docSnap = await getDoc(userDoc);

      if (!docSnap.exists()) {
        // Nuevo usuario - crear documento completo
        const newUserData = {
          uid,
          email: userData.email || '',
          displayName: userData.displayName || '',
          photoURL: userData.photoURL || null,
          role: userData.role || UserRole.USER,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        console.log('📝 Creando nuevo documento en Firestore:', newUserData);
        await setDoc(userDoc, newUserData);
        console.log('✅ Documento creado exitosamente');
      } else {
        // Usuario existente - actualizar
        const updateData = {
          ...userData,
          updatedAt: serverTimestamp()
        };

        console.log('📝 Actualizando documento en Firestore');
        await updateDoc(userDoc, updateData);
        console.log('✅ Documento actualizado exitosamente');
      }
    } catch (error) {
      console.error('❌ Error en createOrUpdateUser:', error);
      throw error;
    }
  }

  /**
   * Obtener usuario por UID
   */
  async getUserByUid(uid: string): Promise<User | null> {
    const userDoc = doc(this.firestore, 'users', uid);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      return docSnap.data() as User;
    }
    return null;
  }

  /**
   * Obtener rol del usuario
   */
  async getUserRole(uid: string): Promise<UserRole | null> {
    const user = await this.getUserByUid(uid);
    return user?.role || null;
  }

  /**
   * Asignar rol a un usuario (solo admin puede hacer esto)
   */
  async assignRole(uid: string, role: UserRole): Promise<void> {
    const userDoc = doc(this.firestore, 'users', uid);
    await updateDoc(userDoc, {
      role,
      updatedAt: serverTimestamp()
    });
  }

  /**
   * Obtener todos los programadores
   */
  getProgrammers(): Observable<User[]> {
    // Obtener todos los usuarios y filtrar en el cliente
    return this.getAllUsers().pipe(
      map((users: User[]) => {
        const programmers = users.filter(u =>
          u.role === ('programmer' as UserRole)
        );
        console.log('👥 Todos los usuarios:', users);
        console.log('👥 Programadores filtrados:', programmers);
        return programmers;
      }),
      catchError(error => {
        console.error('❌ Error obteniendo programadores:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtener todos los usuarios
   */
  getAllUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    return from(getDocs(usersRef)).pipe(
      map(snapshot => {
        const users: User[] = [];
        snapshot.forEach(doc => {
          users.push({
            uid: doc.id,
            ...doc.data()
          } as User);
        });
        console.log('📦 getAllUsers: Usuarios obtenidos desde Firestore:', users);
        return users;
      }),
      catchError(error => {
        console.error('❌ getAllUsers: Error:', error);
        return of([]);
      })
    );
  }

  /**
   * Actualizar perfil de usuario
   */
  async updateUserProfile(uid: string, data: Partial<User>): Promise<void> {
    const userDoc = doc(this.firestore, 'users', uid);
    await updateDoc(userDoc, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }

  /**
   * Eliminar usuario
   */
  async deleteUser(uid: string): Promise<void> {
    const userDoc = doc(this.firestore, 'users', uid);
    await deleteDoc(userDoc);
  }

  /**
   * Verificar si el usuario es admin
   */
  async isAdmin(uid: string): Promise<boolean> {
    const role = await this.getUserRole(uid);
    return role === UserRole.ADMIN;
  }

  /**
   * Verificar si el usuario es programador
   */
  async isProgrammer(uid: string): Promise<boolean> {
    const role = await this.getUserRole(uid);
    return role === UserRole.PROGRAMMER;
  }
}
