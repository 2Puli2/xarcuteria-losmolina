import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { TitleComponent } from '../../components/title/title';
import { LogoComponent } from '../../components/logo/logo';
import { IdiomaService } from '../../idiomas/idioma.service';

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

export interface TablaEspecialRow {
    name: string;
    desc?: string;
    mediaTabla: string;
    tabla: string;
}



/**
 * Página "Carta" — Menú completo con precios.
 * Accesible únicamente vía URL: /carta
 */
@Component({
    selector: 'app-carta',
    imports: [RouterLink, TitleComponent, LogoComponent],
    templateUrl: './carta.html',
    styleUrl: './carta.scss',
})
export class CartaComponent {
    readonly idioma = inject(IdiomaService);
    private readonly titleService = inject(Title);
    private readonly metaService = inject(Meta);

    /** ─── Aperitivos ─── */
    readonly aperitivos: CartaItem[] = [
        { name: 'Surtido de Olivas XXL', price: '3,90' },
        { name: 'Taquitos de Jamón Ibérico', price: '6,50' },
        { name: 'Tapa de Fuet o Longaniza', price: '5,90' },
        { name: 'Flores de Tete de Moine (1u)', price: '2,00' },
        { name: 'Flores de Tete de Moine (5u)', price: '8,00' },
        { name: 'Dados de Queso Semicurado', price: '5,90' },
        { name: 'Dados de Queso Curado', price: '6,90' },
        { name: 'Surtido de Patés', price: '8,50' },
        { name: 'Bloc de Foie', desc: 'Con mermelada y tostadas', price: '12,90' },
        { name: 'Lacón con Pimentón', price: '7,90' },
        { name: 'Salmón Ahumado', desc: 'Con mantequilla y tostadas', price: '9,50' },
        { name: 'Boquerones', price: '6,90' },
        { name: 'Anchoas (5 filetes)', price: '9,90' },
    ];

    /** ─── Conservas Espinaler ─── */
    readonly conservas: CartaItem[] = [
        { name: 'Patatas Chips', price: '2,00' },
        { name: 'Patatas Chips Grandes', price: '3,00' },
        { name: 'Olivas Rellenas', price: '2,70' },
        { name: 'Berberechos 55/65', price: '8,50' },
        { name: 'Berberechos 30/40', price: '9,90' },
        { name: 'Mejillones', price: '4,90' },
        { name: 'Almejas al Natural', price: '5,90' },
        { name: 'Navajas', price: '6,90' },
        { name: 'Sardinas en Aceite de Oliva', price: '4,90' },
        { name: 'Chipirones', price: '6,90' },
        { name: 'Ría de Noia', desc: 'Patatas, olivas, berberechos y boquerones', price: '16,00' },
        { name: 'Ría de Ribadeo', desc: 'Patatas, olivas, berberechos y mejillones', price: '14,50' },
        { name: 'Ría de Muros', desc: 'Patatas, olivas, berberechos, mejillones y anchoas', price: '19,90' },
    ];

    /** ─── Menús (2 personas) ─── */
    readonly menus: CartaItem[] = [
        { name: 'Menú Ibérico', desc: 'Ración de paletilla ibérica, ración de queso semicurado, pan con tomate y 2 bebidas', price: '22,90' },
        { name: 'Menú Bellota', desc: 'Ración de paletilla de bellota, ración de queso curado, pan con tomate y 2 bebidas', price: '26,90' },
        { name: 'Menú Delicatessen', desc: 'Ración de jamón Cinco Jotas, ración de queso Payoyo curado y semicurado, pan con tomate y 2 bebidas', price: '39,90' },
    ];

    /** ─── Embutidos: tabla cruzada ─── */
    readonly embutidoGroups: EmbutidoGroup[] = [
        {
            title: 'Jamón',
            items: [
                { name: 'Paleta Ibérica a Máquina', medioBocadillo: '4,10', bocadilloEntero: '8,20', torrada: '9,50', mediaTabla: '5,50', tabla: '11,00' },
                { name: 'Tabla Mixta', desc: 'Paletilla ibérica y queso semicurado.', mediaTabla: '7,90', tabla: '8,50' },
                { name: 'Paleta de Bellota a Máquina', medioBocadillo: '4,90', bocadilloEntero: '9,80', torrada: '11,50', mediaTabla: '6,50', tabla: '12,90' },
                { name: 'Ibérico de Cebo a Mano', medioBocadillo: '6,50', bocadilloEntero: '10,40', mediaTabla: '7,50', tabla: '15,00' },
                { name: 'Cinco Jotas a Mano', medioBocadillo: '9,00', bocadilloEntero: '18,00', torrada: '18,00', mediaTabla: '13,00', tabla: '25,00' },
                { name: 'Joselito a Mano', medioBocadillo: '9,50', bocadilloEntero: '19,00', torrada: '18,00', mediaTabla: '15,00', tabla: '28,00' },
                { name: 'Jamón Serrano', medioBocadillo: '3,00', bocadilloEntero: '6,00', torrada: '8,00', mediaTabla: '5,00', tabla: '9,00' },

            ],
        },
        {
            title: 'Embutidos ibéricos',
            items: [
                { name: 'Chorizo Ibérico', medioBocadillo: '3,40', bocadilloEntero: '6,80' },
                { name: 'Chorizo Bellota', medioBocadillo: '4,50', bocadilloEntero: '9,00' },
                { name: 'Chorizo Joselito', medioBocadillo: '5,20', bocadilloEntero: '10,40' },
                { name: 'Salchichón Ibérico', medioBocadillo: '3,40', bocadilloEntero: '6,80', torrada: '7,50' },
                { name: 'Salchichón Bellota', medioBocadillo: '4,50', bocadilloEntero: '9,00' },
                { name: 'Salchichón Joselito', medioBocadillo: '6,50', bocadilloEntero: '10,40' },
                { name: 'Lomo Ibérico', medioBocadillo: '4,10', bocadilloEntero: '8,20', torrada: '7,50', mediaTabla: '5,50', tabla: '11,00' },
                { name: 'Lomo Bellota', medioBocadillo: '4,90', bocadilloEntero: '9,80', torrada: '7,50', mediaTabla: '6,00', tabla: '12,00' },
                { name: 'Lomo Joselito', medioBocadillo: '8,50', bocadilloEntero: '17,00', mediaTabla: '9,00', tabla: '16,00' },
                { name: 'Morcón Bellota', medioBocadillo: '4,50', bocadilloEntero: '9,00' },
                { name: 'Presa Cinco Jotas', medioBocadillo: '8,50', bocadilloEntero: '17,00', mediaTabla: '9,00', tabla: '16,00' },
                { name: 'Surtido Ibérico', desc: 'Lomo, chorizo y salchichón', mediaTabla: '5,00', tabla: '9,00' },

            ],
        },
        {
            title: 'Fiambres y embutidos',
            items: [
                { name: 'Jamón Dulce', medioBocadillo: '2,70', bocadilloEntero: '5,40', torrada: '7,50' },
                { name: 'Bull Blanco', medioBocadillo: '2,70', bocadilloEntero: '5,40', torrada: '7,50' },
                { name: 'Bull Negro', medioBocadillo: '2,70', bocadilloEntero: '5,40', torrada: '7,50' },
                { name: 'Mortadela Italiana', medioBocadillo: '2,70', bocadilloEntero: '5,40', torrada: '7,50' },
                { name: 'Mortadela Trufada', medioBocadillo: '3,50', bocadilloEntero: '7,00', torrada: '9,00' },
                { name: 'Catalana Can Duran', medioBocadillo: '2,70', bocadilloEntero: '5,40', torrada: '7,50' },
                { name: 'Catalana Trufada', medioBocadillo: '3,50', bocadilloEntero: '7,00' },
                { name: 'Pechuga de Pavo Natural', medioBocadillo: '2,70', bocadilloEntero: '5,40', torrada: '7,50' },
                { name: 'Pechuga de Pavo Braseada', medioBocadillo: '2,70', bocadilloEntero: '5,40', torrada: '7,50' },
                { name: 'Fuet', medioBocadillo: '2,70', bocadilloEntero: '5,40', torrada: '7,50' },
                { name: 'Longaniza de Vic', medioBocadillo: '3,00', bocadilloEntero: '6,00', torrada: '8,00' },
                { name: 'Cecina', mediaTabla: '5,00', tabla: '9,00' },
                { name: 'Surtido de Fiambres', desc: 'Bull blanco, bull negro, mortadela y catalana', mediaTabla: '5,00', tabla: '9,00' },
                { name: 'Atún', medioBocadillo: '7,00', bocadilloEntero: '11,00', torrada: '8,00'},
                { name: 'Cantábrico', medioBocadillo: '7,00', bocadilloEntero: '11,00', torrada: '8,00'},
            ],
        },
        {
            title: 'Quesos',
            items: [
                { name: 'Queso Semicurado', medioBocadillo: '2,70', bocadilloEntero: '5,40', torrada: '7,50', mediaTabla: '5,00', tabla: '9,00' },
                { name: 'Queso Curado', medioBocadillo: '2,90', bocadilloEntero: '5,80', torrada: '7,50', mediaTabla: '5,00', tabla: '9,00' },
                { name: 'Queso Fresco de Cabra', medioBocadillo: '3,70', bocadilloEntero: '8,00' },
                { name: 'Queso Manchego Peña Nieto', medioBocadillo: '6,20', bocadilloEntero: '12,40', torrada: '8,50', mediaTabla: '7,50', tabla: '14,00' },
                { name: 'Queso Payoyo', mediaTabla: '7,00', tabla: '13,00' },
                { name: 'Tabla Queso Gourmet', desc: 'Señorío de Quevedo, curado al romero, queso trufado y Tete de Moine', mediaTabla: '11,45', tabla: '22,90' },

            ],
        },
    ];

    /** ─── Tablas especiales ─── */
    readonly tablasEspeciales: TablaEspecialRow[] = [
        { name: 'Surtido Ibérico', desc: 'Lomo, chorizo y salchichón', mediaTabla: '5,00', tabla: '9,00' },
        { name: 'Cecina', mediaTabla: '5,00', tabla: '9,00' },
        { name: 'Surtido de Fiambres', desc: 'Bull blanco, bull negro, mortadela y catalana', mediaTabla: '5,00', tabla: '9,00' },
        { name: 'Tabla Mixta', desc: 'Paletilla ibérica y queso semicurado', mediaTabla: '4,50', tabla: '8,50' },
        { name: 'Tabla Queso Gourmet', desc: 'Señorío de Quevedo, curado al romero, queso trufado y Tete de Moine', mediaTabla: '11,45', tabla: '22,90' },
    ];

    /** ─── Biquinis ─── */
    readonly biquinis: BiquiniRow[] = [
        { name: 'Biquini', normal: '2,90', maxi: '5,10' },
        { name: 'Biquini Ibérico', normal: '4,00', maxi: '6,80' },
        { name: 'Biquini Mallorquín', normal: '3,70', maxi: '5,90' },
    ];

    /** ─── Bocadillos Calientes y Especiales ─── */
    readonly calientesOtros: CalientesOtroRow[] = [
        { name: 'Bacon', medio:'1,00', entero: '6,20' },
        { name: 'Lacón', desc:'con pimienton dulce o picante', medio:'1,00',entero: '6,40' },
        { name: 'Sobrasada', medio:'1,00', entero: '2,80' },
        { name: 'Sobrasada Ibérica', desc:'dulce o picante', medio:'1,00', entero: '4,20' },
        { name: 'Chistorra', entero: '6,00' },
        { name: 'Frankfurt', entero: '6,20' },
        { name: 'Pikantwurst', entero: '6,20' },
        { name: 'Cervela', entero: '6,20' },
        { name: 'Bratwurst', entero: '6,20' },
        { name: 'Malagueña', entero: '6,20' }
    ];

    readonly suplementos: SuplementosRow[] = [
        {name: 'Queso havarti', medio: '1,00', entero: '2,00'},
        {name: 'Queso semicurado', medio: '1,00', entero: '2,00'},
        {name: 'Queso curado', medio: '1,00', entero: '2,00'},
        {name: 'Queso manchego', medio: '1,00', entero: '2,00'},
        {name: 'Queso brie', medio: '1,00', entero: '2,00'},
    ]


    /** ─── Pizzas ─── */
    readonly pizzas: CartaItem[] = [
        { name: 'Pizza Jamón dulce', price: '11,90' },
        { name: 'Pizza Jamón ibérico', price: '13,90' },
        { name: 'Pizza Bacon', price: '13,90' },
        { name: 'Pizza Sobrasada y brie', price: '13,90' },
        { name: 'Pizza 4 quesos', price: '13,90' },
    ];

    /** ─── Postres ─── */
    readonly postres: CartaItem[] = [
        { name: 'Trufas con Nata (4 ud)', price: '4,50' },
        { name: 'Coulant de Chocolate con Nata', price: '4,50' },
        { name: 'Tarta Santiago', price: '4,50' },
        { name: 'Mel i mató', price: '3,00' },
    ];

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
