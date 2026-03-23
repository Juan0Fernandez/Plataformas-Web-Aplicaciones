import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfilpage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfilpage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Perfilpage {
  name = signal('Juan ');
  lastName = signal('Fernandez');
  age = signal(24);

  getFullName() {
    return `${this.name()} ${this.lastName()} con edad ${this.age()} años`;
  }

  changeData() {
    this.name.set('Ana');
    this.lastName.set('Gonzales');
    this.age.set(25);
  }

  resetData() {
    this.name.set('Juan ');
    this.lastName.set('Fernandez');
    this.age.set(22);
  }

  changeAge() {
    this.age.set(18);
  }
}
