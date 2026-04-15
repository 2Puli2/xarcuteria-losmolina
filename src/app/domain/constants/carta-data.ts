export interface PriceItem {
    key: string;
    price: string;
}

export interface EmbutidoPriceRow {
    key: string;
    medioBocadillo?: string;
    bocadilloEntero?: string;
    torrada?: string;
    mediaTabla?: string;
    tabla?: string;
}

export interface EmbutidoPriceGroup {
    groupKey: string;
    items: EmbutidoPriceRow[];
}

export interface BiquiniPriceRow {
    key: string;
    normal: string;
    maxi?: string;
}

export interface CalientePriceRow {
    key: string;
    medio?: string;
    entero?: string;
}

export interface SuplementoPriceRow {
    key: string;
    medio: string;
    entero: string;
}

export interface PanPriceRow {
    key: string;
    price: string;
}

export const APERITIVOS_PRICES: PriceItem[] = [
    { key: 'olivas_xxl',        price: '3,90'  },
    { key: 'taquitos_jamon',    price: '6,90'  },
    { key: 'tapa_fuet',         price: '5,90'  },
    { key: 'flores_tete_1',     price: '2,00'  },
    { key: 'flores_tete_5',     price: '8,00'  },
    { key: 'dados_semicurado',  price: '5,90'  },
    { key: 'dados_curado',      price: '6,90'  },
    { key: 'surtido_pates',     price: '8,90'  },
    { key: 'bloc_foie',         price: '12,90' },
    { key: 'lacon_pimenton',    price: '8,90'  },
    { key: 'salmon_ahumado',    price: '9,50'  },
    { key: 'boquerones',        price: '6,90'  },
    { key: 'anchoas',           price: '9,90'  },
];

export const CONSERVAS_PRICES: PriceItem[] = [
    { key: 'patatas_chips',         price: '2,00'  },
    { key: 'patatas_chips_grandes', price: '3,00'  },
    { key: 'olivas_rellenas',       price: '2,70'  },
    { key: 'berberechos_55',        price: '8,90'  },
    { key: 'berberechos_30',        price: '12,50'  },
    { key: 'mejillones',            price: '4,90'  },
    { key: 'almejas',               price: '5,90'  },
    { key: 'navajas',               price: '6,90'  },
    { key: 'sardinas',              price: '4,90'  },
    { key: 'chipirones',            price: '6,90'  },
    { key: 'ria_noia',              price: '18,50' },
    { key: 'ria_ribadeo',           price: '16,50' },
    { key: 'ria_muros',             price: '25,90' },
];

export const MENUS_PRICES: PriceItem[] = [
    { key: 'menu_iberico',      price: '24,90' },
    { key: 'menu_bellota',      price: '28,90' },
    { key: 'menu_delicatessen', price: '44,90' },
];

export const EMBUTIDO_GROUPS_PRICES: EmbutidoPriceGroup[] = [
    {
        groupKey: 'jamon',
        items: [
            { key: 'paleta_iberica_maquina', medioBocadillo: '4,10', bocadilloEntero: '8,20',  torrada: '9,50',  mediaTabla: '5,50',  tabla: '11,00' },
            { key: 'tabla_mixta',                                                                                mediaTabla: '8,90',  tabla: '14,50'  },
            { key: 'paleta_bellota_maquina', medioBocadillo: '4,90', bocadilloEntero: '9,80',  torrada: '11,50', mediaTabla: '6,50',  tabla: '13,00' },
            { key: 'iberico_cebo_mano',      medioBocadillo: '6,50', bocadilloEntero: '13,00', torrada: '12,00', mediaTabla: '7,50',  tabla: '15,00' },
            { key: 'cinco_jotas_mano',       medioBocadillo: '9,00', bocadilloEntero: '18,00', torrada: '18,00', mediaTabla: '13,00', tabla: '25,00' },
            { key: 'joselito_mano',          medioBocadillo: '9,50', bocadilloEntero: '19,00', torrada: '18,00', mediaTabla: '15,00', tabla: '28,00' },
            { key: 'jamon_serrano',          medioBocadillo: '3,00', bocadilloEntero: '6,00',  torrada: '8,00'},
        ],
    },
    {
        groupKey: 'embutidos_ibericos',
        items: [
            { key: 'chorizo_iberico',           medioBocadillo: '3,40', bocadilloEntero: '6,80', torrada: '8,50', mediaTabla: '5,00', tabla: '9,00'    },
            { key: 'chorizo_bellota',           medioBocadillo: '4,50', bocadilloEntero: '9,00', torrada: '10,50', mediaTabla: '8,00', tabla: '15,00'    },
            { key: 'chorizo_jacinto_blazquez',  medioBocadillo: '5,20', bocadilloEntero: '10,40', torrada: '12,50', mediaTabla: '10,50', tabla: '19,50'   },
            { key: 'salchichon_iberico',        medioBocadillo: '3,40', bocadilloEntero: '6,80', torrada: '8,50', mediaTabla: '5,00', tabla: '9,00'    },
            { key: 'salchichon_bellota',        medioBocadillo: '4,50', bocadilloEntero: '9,00', torrada: '10,50', mediaTabla: '8,50', tabla: '15,00'    },
            { key: 'lomo_matanza',              medioBocadillo: '3',    bocadilloEntero: '6'},
            { key: 'lomo_iberico',              medioBocadillo: '4,10', bocadilloEntero: '8,20',  torrada: '9,50', mediaTabla: '5,50', tabla: '11,00'   },
            { key: 'lomo_bellota',              medioBocadillo: '4,90', bocadilloEntero: '9,80',  torrada: '11,50', mediaTabla: '7,00', tabla: '12,00'   },
            { key: 'lomo_joselito',             medioBocadillo: '8,50', bocadilloEntero: '17,00', torrada: '14,00',  mediaTabla: '9,00', tabla: '16,00'  },
            { key: 'presa_cinco_jotas',         medioBocadillo: '8,50', bocadilloEntero: '17,00', torrada: '16,50', mediaTabla: '9,00', tabla: '16,00'   },
            { key: 'morcon_bellota',            medioBocadillo: '4,50', bocadilloEntero: '9,00',  torrada: '10,50'},
            { key: 'surtido_iberico',                                                                              mediaTabla: '6,50', tabla: '12,00'       },
             { key: 'surtido_bellota',                                                                              mediaTabla: '8,00', tabla: '15,00'       },
        ],
    },
    {
        groupKey: 'fiambres',
        items: [
            { key: 'jamon_dulce',           medioBocadillo: '2,90', bocadilloEntero: '5,80', torrada: '7,90', mediaTabla: '5,00', tabla: '9,00'      },
            { key: 'bull_blanco',           medioBocadillo: '2,90', bocadilloEntero: '5,80', torrada: '7,90', mediaTabla: '5,00', tabla: '9,00'      },
            { key: 'bull_negro',            medioBocadillo: '2,90', bocadilloEntero: '5,80', torrada: '7,90', mediaTabla: '5,00', tabla: '9,00'      },
            { key: 'mortadela_italiana',    medioBocadillo: '2,90', bocadilloEntero: '5,80', torrada: '7,90', mediaTabla: '5,00', tabla: '9,00'      },
            { key: 'mortadela_trufada',     medioBocadillo: '3,90', bocadilloEntero: '7,80', torrada: '10,50',mediaTabla: '7,00', tabla: '12,00'     },
            { key: 'catalana_can_duran',    medioBocadillo: '2,90', bocadilloEntero: '5,80', torrada: '7,90', mediaTabla: '5,00', tabla: '9,00'      },
            { key: 'catalana_trufada',      medioBocadillo: '3,50', bocadilloEntero: '7,00', torrada: '9,50', mediaTabla: '6,00', tabla: '11,00'     },
            { key: 'cabeza_de_jabalí',      medioBocadillo: '2,90', bocadilloEntero: '5,80', torrada: '7,90', mediaTabla: '5,00', tabla: '9,00'      },
            { key: 'pechuga_pavo_natural',  medioBocadillo: '2,90', bocadilloEntero: '5,80', torrada: '7,90', mediaTabla: '5,00', tabla: '9,00'      },
            { key: 'pechuga_pavo_braseada', medioBocadillo: '2,90', bocadilloEntero: '5,80', torrada: '7,90', mediaTabla: '5,00', tabla: '9,00'      },
            { key: 'cecina',                medioBocadillo: '4,50', bocadilloEntero: '9,00', torrada: '12,00',mediaTabla: '6,00', tabla: '11,00'     },
            { key: 'fuet',                  medioBocadillo: '2,90', bocadilloEntero: '5,80', torrada: '7,90'                                         },
            { key: 'longaniza_vic',         medioBocadillo: '2,90', bocadilloEntero: '5,80', torrada: '8,90'                                         },
            { key: 'surtido_fiambres',                                                                        mediaTabla: '5,00', tabla: '9,00'      },
            { key: 'atun',                  medioBocadillo: '4,00', bocadilloEntero: '8,00', torrada: '10,00'                                        },
            { key: 'cantabrico',            medioBocadillo: '6,50', bocadilloEntero: '13,00', torrada: '14,00'                                       },
        ],
    },
    {
        groupKey: 'quesos',
        items: [
            { key: 'queso_semicurado',   medioBocadillo: '2,90', bocadilloEntero: '5,40',  torrada: '7,90', mediaTabla: '5,00',  tabla: '9,00'   },
            { key: 'queso_curado',       medioBocadillo: '3,40', bocadilloEntero: '5,80',  torrada: '9,50', mediaTabla: '5,00',  tabla: '9,00'   },
            { key: 'queso_fresco_cabra', medioBocadillo: '4,00', bocadilloEntero: '8,00'                                                         },
            { key: 'queso_manchego',     medioBocadillo: '6,20', bocadilloEntero: '12,40', torrada: '12,90', mediaTabla: '7,50',  tabla: '14,00' },
            { key: 'queso_payoyo',       medioBocadillo: '6,20', bocadilloEntero: '12,40', torrada: '12,90', mediaTabla: '7,50',  tabla: '14,00' },
            { key: 'tabla_queso_gourmet',                                                                                         tabla: '24,90' },
        ],
    },
];
export const PAN_Y_TOSTADAS_PRICES: PanPriceRow [] = [
    {key: 'ración_pan_coca', price: '1,90'},
    {key: 'ración_pan_barra', price: '1,50'},
    {key: 'ración_picos', price: '1,50'},
    {key: 'ración_tostadas', price: '1,50'}
]

export const BIQUINIS_PRICES: BiquiniPriceRow[] = [
    { key: 'biquini',                    normal: '2,90', maxi: '5,10' },
    { key: 'biquini_iberico',            normal: '4,00', maxi: '6,80' },
    { key: 'biquini_mallorquin',         normal: '3,70', maxi: '5,90' },
    { key: 'biquini_dulce_trufado',      normal: '3,90', maxi: '6,50' },
];

export const CALIENTES_PRICES: CalientePriceRow[] = [
    { key: 'bacon',             medio: '3,10', entero: '6,20' },
    { key: 'bacon_curado',      medio: '3,50', entero: '7,00' },
    { key: 'lacon',             medio: '3,50', entero: '7,00' },
    { key: 'sobrasada',         medio: '3,00', entero: '6,00' },
    { key: 'sobrasada_iberica', medio: '4,20', entero: '8,40' },
    { key: 'frankfurt',         medio: '3,10', entero: '6,20' },
    { key: 'chistorra',                        entero: '6,00' },
    { key: 'pikantwurst',                      entero: '6,20' },
    { key: 'cervela',                          entero: '6,20' },
    { key: 'bratwurst',                        entero: '6,20' },
    { key: 'malaguenya',                       entero: '6,20' },
];

export const SUPLEMENTOS_PRICES: SuplementoPriceRow[] = [
    { key: 'havarti',      medio: '1,00', entero: '2,00' },
    { key: 'semicurado',   medio: '1,50', entero: '3,00' },
    { key: 'curado',       medio: '2,00', entero: '4,00' },
    { key: 'manchego',     medio: '3,50', entero: '7,00' },
    { key: 'brie',         medio: '1,50', entero: '3,00' },
    { key: 'fresco_cabra', medio: '2,50', entero: '5,00' },
    { key: 'olivas',       medio: '1,00', entero: '2,00' },

];

export const PIZZAS_PRICES: PriceItem[] = [
    { key: 'pizza_jamon_dulce',            price: '12,90' },
    { key: 'pizza_jamon_dulce_trufado',    price: '12,90' },
    { key: 'pizza_jamon_iberico',          price: '13,90' },
    { key: 'pizza_bacon',                  price: '12,90' },
    { key: 'pizza_sobrasada_brie',         price: '13,90' },
    { key: 'pizza_4_quesos',               price: '14,90' },
    { key: 'pizza_salame_picante',         price: '13,90' },
];

export const POSTRES_PRICES: PriceItem[] = [
    { key: 'trufas',         price: '4,50' },
    { key: 'coulant',        price: '4,50' },
    { key: 'tarta_santiago', price: '2,90' },
    { key: 'mel_i_mato',     price: '3,50' },
];

export interface BebidaItem {
    name: string;
    desc?: string;
    price: string;
    favorite?: boolean;
    glutenFree?: boolean;
}

export const REFRESCOS_DATA: BebidaItem[] = [
    { name: 'Agua Veri 0,33L',                             price: '1,60' },
    { name: 'Agua Veri 0,5L',                              price: '1,80' },
    { name: 'Agua Veri 1,5L',                              price: '2,50' },
    { name: 'Vichy Catalan',  desc: 'Agua con gas',        price: '2,60' },
    { name: 'Zumo de Naranja Natural (pequeño)',           price: '2,90' },
    { name: 'Zumo de Naranja Natural (grande)',            price: '5,00' },
    { name: 'Zumo',     desc: 'Piña, melocotón o naranja', price: '2,10' },
    { name: 'Cacaolat',                                    price: '2,50' },
    { name: 'Horchata Chufi',                              price: '2,50' },
    { name: 'Coca-Cola',                                   price: '2,60' },
    { name: 'Coca-Cola Zero',                              price: '2,60' },
    { name: 'Coca-Cola Zero Zero',                         price: '2,60' },
    { name: 'Fanta Limón',                                 price: '2,60' },
    { name: 'Fanta Naranja',                               price: '2,60' },
    { name: 'Aquarius Limón',                              price: '2,60' },
    { name: 'Fuze Tea',                                    price: '2,60' },
    { name: 'Sprite',                                      price: '2,60' },
    { name: 'Tónica Nordic',                               price: '2,60' },
    { name: 'Trina Naranja',                               price: '2,60' },
    { name: 'Trina Limón',                                 price: '2,60' },
    { name: 'Bitter Kas',                                  price: '2,60' },
];

export const CERVEZAS_DATA: BebidaItem[] = [
    { name: 'Caña de cerveza',     price: '2,00' },
    { name: 'Copa de cerveza',     price: '2,50' },
    { name: 'Jarra de cerveza',    price: '4,00' },
    { name: 'Caña de clara',       price: '2,20' },
    { name: 'Copa de clara',       price: '2,70' },
    { name: 'Jarra de clara',      price: '4,50' },
    { name: 'Turia',               price: '2,60' },
    { name: 'Volldam',             price: '2,80' },
    { name: 'Complot IPA',         price: '3,00' },
    { name: 'Free Damm',           price: '2,60' },
    { name: 'Free Damm Tostada',   price: '2,60' },
    { name: 'Free Damm Lemon',     price: '2,60' },
];

export const VINOS_DATA: BebidaItem[] = [
    { name: 'Copa de vino de la casa', desc: 'Tinto o blanco', price: '2,20' },
    { name: 'Copa de vino Rioja',                              price: '2,70' },
    { name: 'Copa de vino Ribera',                             price: '3,00' },
    { name: 'Copa de vino Verdejo',                            price: '2,80' },
    { name: 'Copa de vino Albariño',                           price: '3,00' },
    { name: 'Copa de cava Brut Nature',                        price: '2,90' },
    { name: 'Vermut Espinaler', desc: 'Blanco o negro',        price: '2,90' },
    { name: 'Tinto de verano',                                 price: '3,50' },
    { name: 'Copa de cava Brut Nature',                        price: '2,90' },
];

export const CAFES_DATA: BebidaItem[] = [
    { name: 'Solo',      price: '1,50' },
    { name: 'Cortado',   price: '1,60' },
    { name: 'Con leche', price: '1,80' },
    { name: 'Capuccino', price: '2,50' },
    { name: 'Americano', price: '1,80' },
    { name: 'Carajillo', price: '2,20' },
    { name: 'Trifásico', price: '2,50' },
    { name: 'Infusión',  price: '1,90' },
    { name: 'Cola Cao',  price: '2,10' },
];
