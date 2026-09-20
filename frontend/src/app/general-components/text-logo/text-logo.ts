import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-logo',
  imports: [],
  templateUrl: './text-logo.html',
  styleUrl: './text-logo.scss',
})
export class TextLogo implements AfterViewInit {

  ngAfterViewInit(): void {
    this.sortAppName();
  }
  @Input({required: true}) text: string = '';
  appName: string = 'POS';
  displayName = '';

  sortAppName() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let iteracion = 0;

    const interval = setInterval(() => {

      this.displayName = this.appName
        .split('')
        .map((letra, index) => {
          if (index < iteracion) {
            return letra;
          }

          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      iteracion += 0.08;

      if (iteracion >= this.appName.length) {
        clearInterval(interval);
        this.displayName = this.appName;
      }

    }, 50);
  }
}
