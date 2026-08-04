import { Component, ViewEncapsulation, computed, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { IdiomaService } from '../../../application/language/language.service';
import { PrecioService } from '../../../application/prices/price.service';
import { EmbutidoGroup, EmbutidoRow } from '../carta/carta';

/** Fila de la tabla de cervezas de grifo (Caña/Copa/Jarra × Cerveza/Clara) */
interface CervezaGrifoRow {
    formato: string;
    cerveza: string;
    clara: string;
}

/** Claves de cerveza que se pintan en la tabla de grifo y no en la lista */
const CERVEZAS_GRIFO_KEYS = [
    'canya_cerveza', 'copa_cerveza', 'jarra_cerveza',
    'canya_clara', 'copa_clara', 'jarra_clara',
];

/**
 * Carta imprimible (A3, 2 páginas) — sustituye a los antiguos
 * public/carta-pdf/carta-{es,cat,en}.html. Usa los mismos precios
 * (PrecioService → Google Sheet con respaldo en código) y las mismas
 * traducciones que la carta web. Para exportar a PDF: Ctrl+P → Guardar como
 * PDF, papel A3, márgenes "Ninguno", con "Gráficos de fondo" activado.
 */
@Component({
    selector: 'app-carta-imprimir',
    templateUrl: './carta-imprimir.html',
    styleUrl: './carta-imprimir.scss',
    // Sin encapsular: la página de impresión usa @page y clases propias .carta-print
    encapsulation: ViewEncapsulation.None,
})
export class CartaImprimirComponent {
    readonly idioma = inject(IdiomaService);
    readonly precios = inject(PrecioService);
    private readonly titleService = inject(Title);
    private readonly metaService = inject(Meta);

    /**
     * Mezcla una colección de precios con el nombre/descripción del idioma activo.
     * Prioridad: la HOJA manda; si no trae la clave, la traducción del código;
     * si tampoco, el nombre que ya traiga el propio item (altas de la hoja) y,
     * como último recurso, la clave.
     */
    private traducir<T extends { key: string; name?: string; desc?: string }>(
        items: T[],
        dic: Record<string, { name: string; desc?: string }>
    ): (T & { name: string; desc?: string })[] {
        const hoja = this.precios.textoHoja();
        return items.map(p => ({
            ...p,
            ...(hoja(p.key) ?? dic[p.key] ?? (p.name ? { name: p.name, desc: p.desc } : { name: p.key })),
        }));
    }

    readonly refrescos = computed(() =>
        this.traducir(this.precios.refrescos(), this.idioma.t().cartaItems.refrescos)
    );

    readonly cafes = computed(() =>
        this.traducir(this.precios.cafes(), this.idioma.t().cartaItems.cafes)
    );

    readonly vinos = computed(() =>
        this.traducir(this.precios.vinos(), this.idioma.t().cartaItems.vinos)
    );

    readonly cervezasGrifo = computed<CervezaGrifoRow[]>(() => {
        const t = this.idioma.t().carta;
        const precio = (key: string) => this.precios.cervezas().find(c => c.key === key)?.price ?? '—';
        return [
            { formato: t.printCanya, cerveza: precio('canya_cerveza'), clara: precio('canya_clara') },
            { formato: t.printCopa,  cerveza: precio('copa_cerveza'),  clara: precio('copa_clara')  },
            { formato: t.printJarra, cerveza: precio('jarra_cerveza'), clara: precio('jarra_clara') },
        ];
    });

    readonly cervezasBotella = computed(() =>
        this.traducir(
            this.precios.cervezas().filter(c => !CERVEZAS_GRIFO_KEYS.includes(c.key)),
            this.idioma.t().cartaItems.cervezas
        )
    );

    readonly aperitivos = computed(() =>
        this.traducir(this.precios.aperitivos(), this.idioma.t().cartaItems.aperitivos)
    );

    readonly conservas = computed(() =>
        this.traducir(this.precios.conservas(), this.idioma.t().cartaItems.conservas)
    );

    readonly menus = computed(() =>
        this.traducir(this.precios.menus(), this.idioma.t().cartaItems.menus)
    );

    readonly embutidoGroups = computed<EmbutidoGroup[]>(() => {
        const groupTitles = this.idioma.t().cartaItems.embutidoGroupTitles as Record<string, string>;
        const items       = this.idioma.t().cartaItems.embutidoItems as Record<string, { name: string; desc?: string }>;
        return this.precios.embutidoGroups().map(g => ({
            title: groupTitles[g.groupKey] ?? g.groupKey,
            items: this.traducir(g.items, items).map(row => ({
                key: row.key,
                name: row.name,
                desc: row.desc,
                medioBocadillo: row.medioBocadillo,
                bocadilloEntero: row.bocadilloEntero,
                torrada: row.torrada,
                mediaTabla: row.mediaTabla,
                tabla: row.tabla,
            })),
        }));
    });

    readonly panYTostadas = computed(() =>
        this.traducir(this.precios.panYTostadas(), this.idioma.t().cartaItems.pan_y_tostadas)
    );

    readonly biquinis = computed(() =>
        this.traducir(this.precios.biquinis(), this.idioma.t().cartaItems.biquinis)
    );

    readonly calientes = computed(() =>
        this.traducir(this.precios.calientes(), this.idioma.t().cartaItems.calientes)
    );

    readonly suplementos = computed(() =>
        this.traducir(
            this.precios.suplementos().filter(p => !p.key.startsWith('suplemento_')),
            this.idioma.t().cartaItems.suplementos
        )
    );

    readonly pizzas = computed(() =>
        this.traducir(this.precios.pizzas(), this.idioma.t().cartaItems.pizzas)
    );

    readonly postres = computed(() =>
        this.traducir(this.precios.postres(), this.idioma.t().cartaItems.postres)
    );

    constructor() {
        this.titleService.setTitle('Carta imprimible — Xarcuteria Los Molina');
        // Página interna para imprimir: fuera del índice de buscadores
        this.metaService.updateTag({ name: 'robots', content: 'noindex' });
    }
}
