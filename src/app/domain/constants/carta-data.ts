

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


export const APERITIVOS_PRICES: PriceItem[] = [
    { key: 'olivas_xxl',        price: '3,90'  },
    { key: 'taquitos_jamon',    price: '6,50'  },
    { key: 'tapa_fuet',         price: '5,90'  },
    { key: 'flores_tete_1',     price: '2,00'  },
    { key: 'flores_tete_5',     price: '8,00'  },
    { key: 'dados_semicurado',  price: '5,90'  },
    { key: 'dados_curado',      price: '6,90'  },
    { key: 'surtido_pates',     price: '8,50'  },
    { key: 'bloc_foie',         price: '12,90' },
    { key: 'lacon_pimenton',    price: '7,90'  },
    { key: 'salmon_ahumado',    price: '9,50'  },
    { key: 'boquerones',        price: '6,90'  },
    { key: 'anchoas',           price: '9,90'  },
];


export const CONSERVAS_PRICES: PriceItem[] = [
    { key: 'patatas_chips',         price: '2,00'  },
    { key: 'patatas_chips_grandes', price: '3,00'  },
    { key: 'olivas_rellenas',       price: '2,70'  },
    { key: 'berberechos_55',        price: '8,50'  },
    { key: 'berberechos_30',        price: '9,90'  },
    { key: 'mejillones',            price: '4,90'  },
    { key: 'almejas',               price: '5,90'  },
    { key: 'navajas',               price: '6,90'  },
    { key: 'sardinas',              price: '4,90'  },
    { key: 'chipirones',            price: '6,90'  },
    { key: 'ria_noia',              price: '16,00' },
    { key: 'ria_ribadeo',           price: '14,50' },
    { key: 'ria_muros',             price: '19,90' },
];


export const MENUS_PRICES: PriceItem[] = [
    { key: 'menu_iberico',      price: '22,90' },
    { key: 'menu_bellota',      price: '26,90' },
    { key: 'menu_delicatessen', price: '39,90' },
];


export const EMBUTIDO_GROUPS_PRICES: EmbutidoPriceGroup[] = [
    {
        groupKey: 'jamon',
        items: [
            { key: 'paleta_iberica_maquina', medioBocadillo: '4,10', bocadilloEntero: '8,20',  torrada: '9,50',  mediaTabla: '5,50',  tabla: '11,00' },
            { key: 'tabla_mixta',                                                               mediaTabla: '7,90',  tabla: '8,50'  },
            { key: 'paleta_bellota_maquina', medioBocadillo: '4,90', bocadilloEntero: '9,80',  torrada: '11,50', mediaTabla: '6,50',  tabla: '12,90' },
            { key: 'iberico_cebo_mano',      medioBocadillo: '6,50', bocadilloEntero: '10,40',                   mediaTabla: '7,50',  tabla: '15,00' },
            { key: 'cinco_jotas_mano',       medioBocadillo: '9,00', bocadilloEntero: '18,00', torrada: '18,00', mediaTabla: '13,00', tabla: '25,00' },
            { key: 'joselito_mano',          medioBocadillo: '9,50', bocadilloEntero: '19,00', torrada: '18,00', mediaTabla: '15,00', tabla: '28,00' },
            { key: 'jamon_serrano',          medioBocadillo: '3,00', bocadilloEntero: '6,00',  torrada: '8,00',  mediaTabla: '5,00',  tabla: '9,00'  },
        ],
    },
    {
        groupKey: 'embutidos_ibericos',
        items: [
            { key: 'chorizo_iberico',     medioBocadillo: '3,40', bocadilloEntero: '6,80'                                                            },
            { key: 'chorizo_bellota',     medioBocadillo: '4,50', bocadilloEntero: '9,00'                                                            },
            { key: 'chorizo_joselito',    medioBocadillo: '5,20', bocadilloEntero: '10,40'                                                           },
            { key: 'salchichon_iberico',  medioBocadillo: '3,40', bocadilloEntero: '6,80',  torrada: '7,50'                                          },
            { key: 'salchichon_bellota',  medioBocadillo: '4,50', bocadilloEntero: '9,00'                                                            },
            { key: 'salchichon_joselito', medioBocadillo: '6,50', bocadilloEntero: '10,40'                                                           },
            { key: 'lomo_iberico',        medioBocadillo: '4,10', bocadilloEntero: '8,20',  torrada: '7,50', mediaTabla: '5,50', tabla: '11,00'      },
            { key: 'lomo_bellota',        medioBocadillo: '4,90', bocadilloEntero: '9,80',  torrada: '7,50', mediaTabla: '6,00', tabla: '12,00'      },
            { key: 'lomo_joselito',       medioBocadillo: '8,50', bocadilloEntero: '17,00',                  mediaTabla: '9,00', tabla: '16,00'      },
            { key: 'morcon_bellota',      medioBocadillo: '4,50', bocadilloEntero: '9,00'                                                            },
            { key: 'presa_cinco_jotas',   medioBocadillo: '8,50', bocadilloEntero: '17,00',                  mediaTabla: '9,00', tabla: '16,00'      },
            { key: 'surtido_iberico',                                                                         mediaTabla: '5,00', tabla: '9,00'       },
        ],
    },
    {
        groupKey: 'fiambres',
        items: [
            { key: 'jamon_dulce',           medioBocadillo: '2,70', bocadilloEntero: '5,40', torrada: '7,50'                                         },
            { key: 'bull_blanco',           medioBocadillo: '2,70', bocadilloEntero: '5,40', torrada: '7,50'                                         },
            { key: 'bull_negro',            medioBocadillo: '2,70', bocadilloEntero: '5,40', torrada: '7,50'                                         },
            { key: 'mortadela_italiana',    medioBocadillo: '2,70', bocadilloEntero: '5,40', torrada: '7,50'                                         },
            { key: 'mortadela_trufada',     medioBocadillo: '3,50', bocadilloEntero: '7,00', torrada: '9,00'                                         },
            { key: 'catalana_can_duran',    medioBocadillo: '2,70', bocadilloEntero: '5,40', torrada: '7,50'                                         },
            { key: 'catalana_trufada',      medioBocadillo: '3,50', bocadilloEntero: '7,00'                                                          },
            { key: 'pechuga_pavo_natural',  medioBocadillo: '2,70', bocadilloEntero: '5,40', torrada: '7,50'                                         },
            { key: 'pechuga_pavo_braseada', medioBocadillo: '2,70', bocadilloEntero: '5,40', torrada: '7,50'                                         },
            { key: 'fuet',                  medioBocadillo: '2,70', bocadilloEntero: '5,40', torrada: '7,50'                                         },
            { key: 'longaniza_vic',         medioBocadillo: '3,00', bocadilloEntero: '6,00', torrada: '8,00'                                         },
            { key: 'cecina',                                                                                   mediaTabla: '5,00', tabla: '9,00'      },
            { key: 'surtido_fiambres',                                                                         mediaTabla: '5,00', tabla: '9,00'      },
            { key: 'atun',                  medioBocadillo: '7,00', bocadilloEntero: '11,00', torrada: '8,00'                                        },
            { key: 'cantabrico',            medioBocadillo: '7,00', bocadilloEntero: '11,00', torrada: '8,00'                                        },
        ],
    },
    {
        groupKey: 'quesos',
        items: [
            { key: 'queso_semicurado',   medioBocadillo: '2,70', bocadilloEntero: '5,40',  torrada: '7,50', mediaTabla: '5,00',  tabla: '9,00'  },
            { key: 'queso_curado',       medioBocadillo: '2,90', bocadilloEntero: '5,80',  torrada: '7,50', mediaTabla: '5,00',  tabla: '9,00'  },
            { key: 'queso_fresco_cabra', medioBocadillo: '3,70', bocadilloEntero: '8,00'                                                         },
            { key: 'queso_manchego',     medioBocadillo: '6,20', bocadilloEntero: '12,40', torrada: '8,50', mediaTabla: '7,50',  tabla: '14,00' },
            { key: 'queso_payoyo',                                                                            mediaTabla: '7,00',  tabla: '13,00' },
            { key: 'tabla_queso_gourmet',                                                                     mediaTabla: '11,45', tabla: '22,90' },
        ],
    },
];


export const BIQUINIS_PRICES: BiquiniPriceRow[] = [
    { key: 'biquini',            normal: '2,90', maxi: '5,10' },
    { key: 'biquini_iberico',    normal: '4,00', maxi: '6,80' },
    { key: 'biquini_mallorquin', normal: '3,70', maxi: '5,90' },
];


export const CALIENTES_PRICES: CalientePriceRow[] = [
    { key: 'bacon',             medio: '1,00', entero: '6,20' },
    { key: 'bacon_curado',      medio: '1,00', entero: '6,20' },
    { key: 'lacon',             medio: '1,00', entero: '6,40' },
    { key: 'sobrasada',         medio: '1,00', entero: '2,80' },
    { key: 'sobrasada_iberica', medio: '1,00', entero: '4,20' },
    { key: 'chistorra',                         entero: '6,00' },
    { key: 'frankfurt',                         entero: '6,20' },
    { key: 'pikantwurst',                       entero: '6,20' },
    { key: 'cervela',                           entero: '6,20' },
    { key: 'bratwurst',                         entero: '6,20' },
    { key: 'malaguenya',                        entero: '6,20' },
];


export const SUPLEMENTOS_PRICES: SuplementoPriceRow[] = [
    { key: 'havarti',    medio: '1,00', entero: '2,00' },
    { key: 'semicurado', medio: '1,00', entero: '2,00' },
    { key: 'curado',     medio: '1,00', entero: '2,00' },
    { key: 'manchego',   medio: '1,00', entero: '2,00' },
    { key: 'brie',       medio: '1,00', entero: '2,00' },
];


export const PIZZAS_PRICES: PriceItem[] = [
    { key: 'pizza_jamon_dulce',    price: '11,90' },
    { key: 'pizza_jamon_iberico',  price: '13,90' },
    { key: 'pizza_bacon',          price: '13,90' },
    { key: 'pizza_sobrasada_brie', price: '13,90' },
    { key: 'pizza_4_quesos',       price: '13,90' },
];


export const POSTRES_PRICES: PriceItem[] = [
    { key: 'trufas',         price: '4,50' },
    { key: 'coulant',        price: '4,50' },
    { key: 'tarta_santiago', price: '4,50' },
    { key: 'mel_i_mato',     price: '3,00' },
];
