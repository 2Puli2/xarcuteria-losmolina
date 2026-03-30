import { Component, input } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.html',
  styleUrl: './title.scss',
})
export class TitleComponent {
  readonly text     = input.required<string>();
  readonly subtitle = input<string>('');
  readonly variant  = input<'dark' | 'light' | 'primary'>('dark');
}
