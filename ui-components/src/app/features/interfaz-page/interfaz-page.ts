import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-interfaz-page',
  standalone: true,
  templateUrl: './interfaz-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterfazPage {}