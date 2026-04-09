import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { TitleComponent } from '../../shared/components/title/title';
import { LogoComponent } from '../../shared/components/logo/logo';
import { LanguageSelectorComponent } from '../../shared/components/language-selector/language-selector';
import { IdiomaService } from '../../../application/language/language.service';
import {
    APERITIVOS_PRICES,
    CONSERVAS_PRICES,
    MENUS_PRICES,
    EMBUTIDO_GROUPS_PRICES,
    PAN_Y_TOSTADAS_PRICES,
    BIQUINIS_PRICES,
    CALIENTES_PRICES,
    SUPLEMENTOS_PRICES,
    PIZZAS_PRICES,
    POSTRES_PRICES,
    REFRESCOS_DATA,
    CERVEZAS_DATA,
    VINOS_DATA,
    CAFES_DATA,
    BebidaItem,
} from '../../../domain/constants/carta-data';


export interface CartaItem {
    name: string;
    desc?: string;
    price?: string;
}

export interface BiquiniRow {
    name: string;
    desc?: string;
    normal: string;
    maxi?: string;
}

export interface CalientesOtroRow {
    name: string;
    desc?: string;
    medio?: string;
    entero?: string;
}

export interface SuplementosRow {
    name: string;
    desc?: string;
    medio: string;
    entero: string;
}

export interface EmbutidoRow {
    name: string;
    desc?: string;
    medioBocadillo?: string;
    bocadilloEntero?: string;
    torrada?: string;
    mediaTabla?: string;
    tabla?: string;
}

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
    private readonly titleService = inject(Title);
    private readonly metaService = inject(Meta);

    readonly aperitivos = computed<CartaItem[]>(() => {
        const t = this.idioma.t().cartaItems.aperitivos as Record<string, CartaItem>;
        return APERITIVOS_PRICES.map(p => ({ ...(t[p.key] ?? { name: p.key }), price: p.price }));
    });

    readonly conservas = computed<CartaItem[]>(() => {
        const t = this.idioma.t().cartaItems.conservas as Record<string, CartaItem>;
        return CONSERVAS_PRICES.map(p => ({ ...(t[p.key] ?? { name: p.key }), price: p.price }));
    });

    readonly menus = computed<CartaItem[]>(() => {
        const t = this.idioma.t().cartaItems.menus as Record<string, CartaItem>;
        return MENUS_PRICES.map(p => ({ ...(t[p.key] ?? { name: p.key }), price: p.price }));
    });

    readonly embutidoGroups = computed<EmbutidoGroup[]>(() => {
        const groupTitles = this.idioma.t().cartaItems.embutidoGroupTitles as Record<string, string>;
        const items       = this.idioma.t().cartaItems.embutidoItems as Record<string, EmbutidoRow>;
        return EMBUTIDO_GROUPS_PRICES.map(g => ({
            title: groupTitles[g.groupKey] ?? g.groupKey,
            items: g.items.map(row => ({
                ...(items[row.key] ?? { name: row.key }),
                medioBocadillo: row.medioBocadillo,
                bocadilloEntero: row.bocadilloEntero,
                torrada: row.torrada,
                mediaTabla: row.mediaTabla,
                tabla: row.tabla,
            })),
        }));
    });

    readonly biquinis = computed<BiquiniRow[]>(() => {
        const t = this.idioma.t().cartaItems.biquinis as Record<string, CartaItem>;
        return BIQUINIS_PRICES.map(p => ({
            ...(t[p.key] ?? { name: p.key }),
            normal: p.normal,
            maxi: p.maxi,
        }));
    });

    readonly calientesOtros = computed<CalientesOtroRow[]>(() => {
        const t = this.idioma.t().cartaItems.calientes as Record<string, CalientesOtroRow>;
        return CALIENTES_PRICES.map(p => ({
            ...(t[p.key] ?? { name: p.key }),
            medio: p.medio,
            entero: p.entero,
        }));
    });

    readonly suplementos = computed<SuplementosRow[]>(() => {
        const t = this.idioma.t().cartaItems.suplementos as Record<string, CartaItem>;
        return SUPLEMENTOS_PRICES.filter(p => !p.key.startsWith('suplemento_')).map(p => ({
            ...(t[p.key] ?? { name: p.key }),
            medio: p.medio,
            entero: p.entero,
        }));
    });

    readonly panYTostadas = computed<CartaItem[]>(() => {
        const t = this.idioma.t().cartaItems.pan_y_tostadas as Record<string, CartaItem>;
        return PAN_Y_TOSTADAS_PRICES.map(p => ({ ...(t[p.key] ?? { name: p.key }), price: p.price }));
    });

    readonly pizzas = computed<CartaItem[]>(() => {
        const t = this.idioma.t().cartaItems.pizzas as Record<string, CartaItem>;
        return PIZZAS_PRICES.map(p => ({ ...(t[p.key] ?? { name: p.key }), price: p.price }));
    });

    readonly postres = computed<CartaItem[]>(() => {
        const t = this.idioma.t().cartaItems.postres as Record<string, CartaItem>;
        return POSTRES_PRICES.map(p => ({ ...(t[p.key] ?? { name: p.key }), price: p.price }));
    });

    readonly refrescos: BebidaItem[] = REFRESCOS_DATA;
    readonly cervezas: BebidaItem[] = CERVEZAS_DATA;
    readonly vinos: BebidaItem[] = VINOS_DATA;
    readonly cafes: BebidaItem[] = CAFES_DATA;

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
