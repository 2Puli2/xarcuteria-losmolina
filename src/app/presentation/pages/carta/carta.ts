import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { TitleComponent } from '../../shared/components/title/title';
import { LogoComponent } from '../../shared/components/logo/logo';
import { LanguageSelectorComponent } from '../../shared/components/language-selector/language-selector';
import { IdiomaService } from '../../../application/language/language.service';
import { PrecioService } from '../../../application/prices/price.service';
import { BebidaItem } from '../../../domain/constants/carta-data';


/**
 * `key` viaja hasta la plantilla para usarla como `track` de los @for: es lo
 * único único de verdad. El nombre no vale — ahora sale de la hoja y la dueña
 * puede repetirlo sin querer, y dos claves de track iguales hacen que Angular
 * reutilice mal las filas (NG0955).
 */
export interface CartaItem {
    key: string;
    name: string;
    desc?: string;
    price?: string;
}

export interface BiquiniRow {
    key: string;
    name: string;
    desc?: string;
    normal: string;
    maxi?: string;
}

export interface CalientesOtroRow {
    key: string;
    name: string;
    desc?: string;
    medio?: string;
    entero?: string;
}

export interface SuplementosRow {
    key: string;
    name: string;
    desc?: string;
    medio: string;
    entero: string;
}

export interface EmbutidoRow {
    key: string;
    name: string;
    desc?: string;
    medioBocadillo?: string;
    bocadilloEntero?: string;
    torrada?: string;
    mediaTabla?: string;
    tabla?: string;
}

/** Diccionario de traducciones del código: solo aporta textos, nunca la clave */
type TextoDic = Record<string, { name: string; desc?: string }>;

export interface EmbutidoGroup {
    title: string;
    items: EmbutidoRow[];
}

@Component({
    selector: 'app-carta',
    imports: [RouterLink, TitleComponent, LogoComponent, LanguageSelectorComponent],
    templateUrl: './carta.html',
    styleUrl: './carta.scss',
})
export class CartaComponent {
    readonly idioma = inject(IdiomaService);
    readonly precios = inject(PrecioService);
    private readonly titleService = inject(Title);
    private readonly metaService = inject(Meta);

    /**
     * Nombre y descripción de una fila. Prioridad: la HOJA manda; si no trae la
     * clave, la traducción del código; si tampoco, el texto que venga en la
     * propia fila (altas de la hoja) y, como último recurso, la clave.
     */
    private texto(
        p: { key: string; name?: string; desc?: string },
        dic: Record<string, { name: string; desc?: string }>,
    ): { name: string; desc?: string } {
        return (
            this.precios.textoHoja()(p.key) ??
            dic[p.key] ??
            (p.name ? { name: p.name, desc: p.desc } : { name: p.key })
        );
    }

    /** Lista de precio único (aperitivos, pizzas, postres…) ya traducida */
    private lista(
        items: { key: string; price: string; name?: string; desc?: string }[],
        dic: Record<string, { name: string; desc?: string }>,
    ): CartaItem[] {
        return items.map(p => ({ key: p.key, ...this.texto(p, dic), price: p.price }));
    }

    /** Bocadillo del día (de la hoja) o null: el recuadro de la cabecera decide con esto */
    readonly bocadilloDelDia = this.precios.bocadilloDelDia;

    readonly aperitivos = computed<CartaItem[]>(() =>
        this.lista(this.precios.aperitivos(), this.idioma.t().cartaItems.aperitivos)
    );

    readonly conservas = computed<CartaItem[]>(() =>
        this.lista(this.precios.conservas(), this.idioma.t().cartaItems.conservas)
    );

    readonly menus = computed<CartaItem[]>(() =>
        this.lista(this.precios.menus(), this.idioma.t().cartaItems.menus)
    );

    readonly embutidoGroups = computed<EmbutidoGroup[]>(() => {
        const groupTitles = this.idioma.t().cartaItems.embutidoGroupTitles as Record<string, string>;
        const items       = this.idioma.t().cartaItems.embutidoItems as TextoDic;
        return this.precios.embutidoGroups().map(g => ({
            title: groupTitles[g.groupKey] ?? g.groupKey,
            items: g.items.map(row => ({
                key: row.key,
                ...this.texto(row, items),
                medioBocadillo: row.medioBocadillo,
                bocadilloEntero: row.bocadilloEntero,
                torrada: row.torrada,
                mediaTabla: row.mediaTabla,
                tabla: row.tabla,
            })),
        }));
    });

    readonly biquinis = computed<BiquiniRow[]>(() => {
        const t = this.idioma.t().cartaItems.biquinis as TextoDic;
        return this.precios.biquinis().map(p => ({
            key: p.key,
            ...this.texto(p, t),
            normal: p.normal,
            maxi: p.maxi,
        }));
    });

    readonly calientesOtros = computed<CalientesOtroRow[]>(() => {
        const t = this.idioma.t().cartaItems.calientes as TextoDic;
        return this.precios.calientes().map(p => ({
            key: p.key,
            ...this.texto(p, t),
            medio: p.medio,
            entero: p.entero,
        }));
    });

    readonly suplementos = computed<SuplementosRow[]>(() => {
        const t = this.idioma.t().cartaItems.suplementos as TextoDic;
        return this.precios.suplementos().filter(p => !p.key.startsWith('suplemento_')).map(p => ({
            key: p.key,
            ...this.texto(p, t),
            medio: p.medio,
            entero: p.entero,
        }));
    });

    readonly panYTostadas = computed<CartaItem[]>(() =>
        this.lista(this.precios.panYTostadas(), this.idioma.t().cartaItems.pan_y_tostadas)
    );

    readonly pizzas = computed<CartaItem[]>(() =>
        this.lista(this.precios.pizzas(), this.idioma.t().cartaItems.pizzas)
    );

    readonly postres = computed<CartaItem[]>(() =>
        this.lista(this.precios.postres(), this.idioma.t().cartaItems.postres)
    );

    readonly refrescos = computed<BebidaItem[]>(() => {
        const t = this.idioma.t().cartaItems.refrescos as TextoDic;
        return this.precios.refrescos().map(p => ({ ...p, ...this.texto(p, t) }));
    });

    readonly cervezas = computed<BebidaItem[]>(() => {
        const t = this.idioma.t().cartaItems.cervezas as TextoDic;
        return this.precios.cervezas().map(p => ({ ...p, ...this.texto(p, t) }));
    });

    readonly vinos = computed<BebidaItem[]>(() => {
        const t = this.idioma.t().cartaItems.vinos as TextoDic;
        return this.precios.vinos().map(p => ({ ...p, ...this.texto(p, t) }));
    });

    readonly cafes = computed<BebidaItem[]>(() => {
        const t = this.idioma.t().cartaItems.cafes as TextoDic;
        return this.precios.cafes().map(p => ({ ...p, ...this.texto(p, t) }));
    });

    scrollTo(sectionId: string): void {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    constructor() {
        this.titleService.setTitle('Carta — Charcutería Los Molina');
        this.metaService.updateTag({
            name: 'description',
            content: 'Consulta nuestra carta completa: aperitivos, conservas Espinaler, embutidos ibéricos, bocadillos, pizzas y postres en El Prat de Llobregat.',
        });
    }
}
