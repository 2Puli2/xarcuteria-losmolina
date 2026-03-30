import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class ButtonComponent {
  readonly label   = input.required<string>();
  readonly variant = input<'primary' | 'secondary' | 'outline'>('primary');
  readonly clicked = output<void>();

  onClick(): void {
    this.clicked.emit();
  }
}
