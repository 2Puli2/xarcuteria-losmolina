import { Component, input, output, inject } from '@angular/core';
import { LogoComponent } from '../../shared/components/logo/logo';
import { IdiomaService } from '../../../application/language/language.service';

@Component({
  selector: 'app-header',
  imports: [LogoComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  readonly idioma = inject(IdiomaService);
  readonly hiding = input(false);
  readonly openSidebar = output<void>();
}
