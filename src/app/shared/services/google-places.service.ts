import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description: string;
}

/**
 * Servicio para obtener reseñas reales desde Google Places API.
 * Intenta la API New primero, luego la API legacy como fallback.
 * Usa proxy de Angular CLI para evitar problemas de CORS.
 */
@Injectable({
  providedIn: 'root',
})
export class GooglePlacesService {
  private readonly PLACE_ID = 'ChIJq6rmpcSepBIRd1DTH-hGCFA';
  private readonly API_KEY = 'AIzaSyBnWo0NDberDpZxN84TjzZerTkTmgueEJY';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las reseñas reales del negocio.
   * Intenta Places API (New) → Places API legacy → devuelve vacío.
   */
  getBusinessReviews(): Observable<GoogleReview[]> {
    return this.fetchFromNewApi().pipe(
      switchMap((reviews) => {
        if (reviews.length > 0) {
          console.log('✓ Reseñas obtenidas desde Places API (New)');
          return of(reviews);
        }
        // Si la API New no devuelve nada, probar la legacy
        return this.fetchFromLegacyApi();
      }),
      catchError(() => {
        // Si la API New falla, probar la legacy
        return this.fetchFromLegacyApi();
      })
    );
  }

  /**
   * Places API (New) — requiere "Places API (New)" habilitada en Google Cloud
   */
  private fetchFromNewApi(): Observable<GoogleReview[]> {
    const url = `/google-places-api/v1/places/${this.PLACE_ID}`;

    return this.http
      .get<any>(url, {
        headers: {
          'X-Goog-Api-Key': this.API_KEY,
          'X-Goog-FieldMask': 'reviews',
          'Accept-Language': 'es-ES',
        },
      })
      .pipe(
        map((response) => {
          const reviews = response.reviews || [];
          return reviews
            .filter((r: any) => r.rating >= 4)
            .map((r: any) => ({
              author_name: r.authorAttribution?.displayName || 'Cliente',
              rating: r.rating,
              text: r.text?.text || r.originalText?.text || '',
              time: r.publishTime ? new Date(r.publishTime).getTime() / 1000 : 0,
              relative_time_description: this.getSpanishRelativeTime(r.publishTime) || 'Recientemente',
            }))
            // Ordenar por más recientes primero
            .sort((a: GoogleReview, b: GoogleReview) => b.time - a.time);
        }),
        catchError((err) => {
          console.warn('Places API (New) no disponible:', err.status || err.message);
          return of([]);
        })
      );
  }

  /**
   * Places API (legacy) — requiere "Places API" habilitada en Google Cloud
   */
  private fetchFromLegacyApi(): Observable<GoogleReview[]> {
    const url = `/google-maps-api/maps/api/place/details/json`;

    return this.http
      .get<any>(url, {
        params: {
          place_id: this.PLACE_ID,
          fields: 'reviews',
          key: this.API_KEY,
          language: 'es', // Solicita reseñas en español
        },
      })
      .pipe(
        map((response) => {
          if (response.status !== 'OK') {
            console.warn('Places API legacy respondió con estado:', response.status);
            return [];
          }
          const reviews = response.result?.reviews || [];
          console.log('✓ Reseñas obtenidas desde Places API (legacy)');
          return reviews
            .filter((r: any) => r.rating >= 4)
            .map((r: any) => ({
              author_name: r.author_name || 'Cliente',
              rating: r.rating,
              text: r.text || '',
              time: r.time || 0,
              relative_time_description: r.relative_time_description || 'Recientemente',
            }))
            // Ordenar por más recientes primero
            .sort((a: GoogleReview, b: GoogleReview) => b.time - a.time);
        }),
        catchError((err) => {
          console.warn('Places API legacy tampoco disponible:', err.status || err.message);
          return of([]);
        })
      );
  }

  /**
   * Convierte timestamp a texto relativo en español
   * Ej: "Hace 2 semanas", "Hace 3 días"
   */
  private getSpanishRelativeTime(publishTime: string): string {
    if (!publishTime) return 'Recientemente';

    try {
      const now = new Date();
      const reviewDate = new Date(publishTime);
      const diffMs = now.getTime() - reviewDate.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      const diffWeeks = Math.floor(diffDays / 7);
      const diffMonths = Math.floor(diffDays / 30);
      const diffYears = Math.floor(diffDays / 365);

      if (diffSecs < 60) return 'Hace unos segundos';
      if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
      if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
      if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
      if (diffWeeks < 4) return `Hace ${diffWeeks} ${diffWeeks === 1 ? 'semana' : 'semanas'}`;
      if (diffMonths < 12) return `Hace ${diffMonths} ${diffMonths === 1 ? 'mes' : 'meses'}`;
      return `Hace ${diffYears} ${diffYears === 1 ? 'año' : 'años'}`;
    } catch (e) {
      return 'Recientemente';
    }
  }
}
