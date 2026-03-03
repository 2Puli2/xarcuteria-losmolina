import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

interface Sparkle {
  x: number;
  y: number;
  element: HTMLElement;
}

/**
 * Servicio que añade partículas de purpurina (sparkles) en el rastro del mouse.
 */
@Injectable({
  providedIn: 'root',
})
export class CursorSparklesService {
  private document = inject(DOCUMENT);
  private sparkles: Sparkle[] = [];
  private lastX = 0;
  private lastY = 0;
  private distance = 10; // Mínima distancia entre sparkles
  private container: HTMLElement | null = null;

  /**
   * Inicializa el efecto de sparkles del cursor.
   */
  init(): void {
    if (!this.document) return;

    // Crear contenedor para las sparkles
    this.container = this.document.createElement('div');
    this.container.id = 'sparkles-container';
    Object.assign(this.container.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '9999',
      overflow: 'hidden',
    });

    this.document.body.appendChild(this.container);

    // Evento de movimiento del mouse
    this.document.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  /**
   * Maneja el movimiento del mouse y crea sparkles.
   */
  private onMouseMove(e: MouseEvent): void {
    const { clientX, clientY } = e;

    // Calcular distancia desde el último sparkle
    const dx = clientX - this.lastX;
    const dy = clientY - this.lastY;
    const d = Math.sqrt(dx * dx + dy * dy);

    if (d > this.distance) {
      this.createSparkle(clientX, clientY);
      this.lastX = clientX;
      this.lastY = clientY;
    }
  }

  /**
   * Crea una partícula de purpurina en la posición del mouse.
   */
  private createSparkle(x: number, y: number): void {
    if (!this.container) return;

    const sparkle = this.document.createElement('div');

    // Estilos de la partícula
    const size = Math.random() * 6 + 2; // Entre 2px y 8px
    const opacity = Math.random() * 0.7 + 0.3; // Entre 0.3 y 1

    Object.assign(sparkle.style, {
      position: 'absolute',
      left: x + 'px',
      top: y + 'px',
      width: size + 'px',
      height: size + 'px',
      borderRadius: '50%',
      backgroundColor: this.getRandomColor(),
      pointerEvents: 'none',
      opacity: opacity.toString(),
      transform: 'translate(-50%, -50%)',
      boxShadow: `0 0 ${size * 2}px currentColor`,
    });

    this.container.appendChild(sparkle);

    // Animar la partícula
    this.animateSparkle(sparkle);
  }

  /**
   * Anima la partícula de purpurina con desvanecimiento y movimiento.
   */
  private animateSparkle(element: HTMLElement): void {
    const duration = Math.random() * 1000 + 500; // Entre 500ms y 1500ms
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50 + 30; // Entre 30px y 80px
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress > 1) {
        element.remove();
        return;
      }

      const opacity = 1 - progress;
      const x = tx * progress;
      const y = ty * progress - progress * progress * 20; // Efecto de caída

      element.style.opacity = opacity.toString();
      element.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;

      requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * Retorna un color aleatorio de una paleta cálida/dorada.
   */
  private getRandomColor(): string {
    const colors = [
      '#FFD700', // Gold
      '#FFA500', // Orange
      '#FF69B4', // Hot Pink
      '#FF6347', // Tomato
      '#FFB6C1', // Light Pink
      '#FFE4B5', // Moccasin
      '#FFDAB9', // Peach Puff
      '#EE82EE', // Violet
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
