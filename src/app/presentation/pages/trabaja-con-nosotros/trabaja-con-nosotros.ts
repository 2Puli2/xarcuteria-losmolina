import { Component, signal, OnInit, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TitleComponent } from '../../shared/components/title/title';
import { LogoComponent } from '../../shared/components/logo/logo';
import { IdiomaService } from '../../../application/language/language.service';
import { SeoService } from '../../../application/seo/seo.service';
import emailjs from '@emailjs/browser';

interface TrabajaForm {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
}

@Component({
  selector: 'app-trabaja-con-nosotros',
  imports: [FormsModule, RouterLink, TitleComponent, LogoComponent],
  templateUrl: './trabaja-con-nosotros.html',
  styleUrl: './trabaja-con-nosotros.scss',
})
export class TrabajaConNosotrosComponent implements OnInit {
  readonly idioma = inject(IdiomaService);
  private readonly seo = inject(SeoService);

  private readonly SERVICE_ID  = 'service_0808xxx';
  private readonly TEMPLATE_ID = 'template_vxlpw9o';
  private readonly PUBLIC_KEY  = 'pCMTeHrtDSEi00nyY';

  readonly form = signal<TrabajaForm>({ nombre: '', email: '', telefono: '', mensaje: '' });
  readonly enviado   = signal(false);
  readonly enviando  = signal(false);
  readonly error     = signal<string>('');

  constructor() {
    effect(() => this.seo.setPageSeo(this.idioma.currentLang(), 'trabaja'));
  }

  ngOnInit(): void {
    emailjs.init(this.PUBLIC_KEY);
  }

  updateField(field: keyof TrabajaForm, value: string): void {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  async onSubmit(): Promise<void> {
    const { nombre, email, telefono, mensaje } = this.form();

    if (!nombre || !email || !mensaje) {
      this.error.set(this.idioma.t().work.errorRequired);
      return;
    }

    this.enviando.set(true);
    this.error.set('');

    try {

      await emailjs.send(this.SERVICE_ID, this.TEMPLATE_ID, {
        nombre,
        email,
        telefono,
        mensaje,
      });

      this.enviando.set(false);
      this.enviado.set(true);
      this.form.set({ nombre: '', email: '', telefono: '', mensaje: '' });
    } catch (error) {
      this.enviando.set(false);
      this.error.set(this.idioma.t().work.errorSend);
      console.error('EmailJS error:', error);
    }
  }
}
