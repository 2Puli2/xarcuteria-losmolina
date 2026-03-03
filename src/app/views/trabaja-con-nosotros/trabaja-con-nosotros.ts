import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TitleComponent } from '../../components/title/title';
import { LogoComponent } from '../../components/logo/logo';
import { IdiomaService } from '../../idiomas/idioma.service';
import emailjs from '@emailjs/browser';

interface TrabajaForm {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
}

/**
 * Página de "Trabaja con nosotros".
 * Formulario que envía automáticamente el email vía EmailJS.
 */
@Component({
  selector: 'app-trabaja-con-nosotros',
  imports: [FormsModule, RouterLink, TitleComponent, LogoComponent],
  templateUrl: './trabaja-con-nosotros.html',
  styleUrl: './trabaja-con-nosotros.scss',
})
export class TrabajaConNosotrosComponent implements OnInit {
  // EmailJS credentials
  private readonly SERVICE_ID = 'service_0808xxx';
  private readonly TEMPLATE_ID = 'template_vxlpw9o';
  private readonly PUBLIC_KEY = 'pCMTeHrtDSEi00nyY';

  readonly form = signal<TrabajaForm>({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  });

  readonly enviado = signal(false);
  readonly enviando = signal(false);
  readonly error = signal<string>('');

  constructor(readonly idioma: IdiomaService) {}

  ngOnInit(): void {
    // Inicializar EmailJS
    emailjs.init(this.PUBLIC_KEY);
  }

  updateField(field: keyof TrabajaForm, value: string): void {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  async onSubmit(): Promise<void> {
    const { nombre, email, mensaje } = this.form();

    if (!nombre || !email || !mensaje) {
      this.error.set(this.idioma.t().work.errorRequired);
      return;
    }

    this.enviando.set(true);
    this.error.set('');

    try {
      const { nombre, email, telefono, mensaje } = this.form();

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
