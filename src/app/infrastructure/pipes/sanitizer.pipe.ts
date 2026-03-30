import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Pipe para sanitizar URLs de recursos externos (iframes, etc).
 * Necesario para que Angular confíe en las URLs de Google Maps.
 */
@Pipe({
  name: 'sanitizer',
  standalone: true,
})
export class SanitizerPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
