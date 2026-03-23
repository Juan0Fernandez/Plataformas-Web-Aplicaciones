import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-homepage',
  imports: [],
  templateUrl: './homepage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true // Asumiendo que es un componente standalone
})
export class Homepage implements OnInit {
  
  ngOnInit(): void {
    this.startAutomaticSignalIncrement();
  }

  startAutomaticSignalIncrement(): void {
    setInterval(() => {
      this.counterSignal.update(current => current + 1);
    }, 1000); 
  }

  counter = 0;
  counterSignal = signal(0);

  changeValude(value: number) {
    this.counter += value;
  }

  resetValue(value: number) {
    this.counter = value;
    this.counterSignal.set(value);
  }
}