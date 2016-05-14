'use strict';

import TableQueries = require('../db/queries/TableQueries');

interface ITreeChild {
    source: string;
    filters?: any;
    fields?: any;
}

interface ITreeNode {
    label: string;
    id?: number;
    child?: ITreeChild;
    children?: ITreeNode[];
}

var tree: ITreeNode = {
    label: "Oil & Gas",
    children: [
        {
            label: 'Exploração',
            children: [
                {
                    label: 'Blocos',
                    child: {
                        source: 'Blocks'
                    }
                },
                {
                    label: 'Sondas',
                    child: {
                        source: 'DrillingRigs'
                    }
                },
                {
                    label: 'Poços',
                    child: {
                        source: 'Wells'
                    }
                },
                {
                    label: 'Sísmica',
                    child: {
                        source: 'Seismics'
                    }
                },
            ]
        },
        {
            label: 'Produção',
            children: [
                {
                    label: 'FPSOs',
                    child: {
                        source: 'FPSOs'
                    }
                },
                {
                    label: 'UPEs Fixas',
                    child: {
                        source: 'FixedProductionUnits'
                    }
                },
                {
                    label: 'UPE FPSs Semi',
                    child: {
                        source: 'SemiSubmersibleProductionUnits'
                    }
                },
                {
                    label: 'Campos em fase de desenvolvimento',
                    child: {
                        source: 'oilFieldsDevelopment'
                    }
                },
                {
                    label: 'Campos em fase de produção',
                    child: {
                        source: 'oilFielsdProduction'
                    }
                },
            ]
        },
        /*{
            label: 'Produção',
            children: [
                {
                    label: 'Onshore',
                    children: [
                    ]
                },
                {
                    label: 'Offshore',
                    children: [
                        {
                            label: 'Campos em fase de desenvolvimento',
                            child: {
                                source: 'OilFieldDeveloping',
                                filters: {
                                    shore: 'off'
                                }
                            }
                        },
                        {
                            label: 'Campos em fase de produção',
                            child: {
                                source: 'OilFieldProduction',
                                filters: {
                                    shore: 'off'
                                }
                            }
                        }
                    ]
                },
                {
                    label: 'UEPs',
                    children: [
                        {
                            label: 'Em construção',
                            children: [
                                {
                                    label: 'FPSOs',
                                    child: {
                                        source: 'FPSOProduction',
                                        filters: {
                                            status: 'construction'
                                        }
                                    }
                                },
                                {
                                    label: 'Fixas',
                                    child: {
                                        source: 'FPSOProduction'
                                    }
                                }
                            ]
                        },
                        {
                            label: 'Em operação',
                            children: [
                                {
                                    label: 'FPSOs',
                                    child: {
                                        source: 'FPSOProduction',
                                        filters: {
                                            status: 'operation'
                                        }
                                    }
                                },
                                {
                                    label: 'Fixas',
                                    child: {
                                        source: 'FPSOProduction'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    label: 'Reservas',
                    children: [
                        {
                            label: 'Reservas Provadas Óleo',
                            children: [
                                {
                                    label: 'Onshore',
                                    child: {
                                        source: 'ReserveProvenOil',
                                        filters: {
                                            shore: 'on'
                                        }
                                    }
                                },
                                {
                                    label: 'Offshore',
                                    child: {
                                        source: 'ReserveProvenOil',
                                        filters: {
                                            shore: 'off'
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            label: 'Reservas Provadas Gás',
                            children: [
                                {
                                    label: 'Onshore',
                                    child: {
                                        source: 'ReserveProvenGas',
                                        filters: {
                                            shore: 'on'
                                        }
                                    }
                                },
                                {
                                    label: 'Offshore',
                                    child: {
                                        source: 'ReserveProvenGas',
                                        filters: {
                                            shore: 'off'
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            label: 'Reservas Totais Óleo',
                            children: [
                                {
                                    label: 'Onshore',
                                    child: {
                                        source: 'ReserveTotalOil',
                                        filters: {
                                            shore: 'on'
                                        }
                                    }
                                },
                                {
                                    label: 'Offshore',
                                    child: {
                                        source: 'ReserveTotalOil',
                                        filters: {
                                            shore: 'off'
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            label: 'Reservas Totais Gás',
                            children: [
                                {
                                    label: 'Onshore',
                                    child: {
                                        source: 'ReserveTotalGas',
                                        filters: {
                                            shore: 'on'
                                        }
                                    }
                                },
                                {
                                    label: 'Offshore',
                                    child: {
                                        source: 'ReserveTotalGas',
                                        filters: {
                                            shore: 'off'
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            label: 'Notícias',
            child: {
                source: 'News'
            }
        },
        {
            label: 'Logística',
            children: [
                {
                    label: 'Barcos de apoio'
                },
                {
                    label: 'Oleodutos'
                },
                {
                    label: 'Gasodutos'
                },
                {
                    label: 'Terminais',
                    children: [
                        {
                            label: 'Onshore'
                        },
                        {
                            label: 'Offshore'
                        }
                    ]
                },
                {
                    label: 'Tankers',
                    children: [
                        {
                            label: 'Transpetro'
                        },
                        {
                            label: 'Outros'
                        }
                    ]
                }
            ]
        },
        {
            label: 'Downstream',        
            children: [
                {
                    label: 'Refino'
                },
                {
                    label: 'Produção de biodiesel'
                },
                {
                    label: 'Venda de derivados'
                }
            ]
        },
        */
        {
            label: 'Refinarias',
            child: {
                source: 'Refineries'
            }
        },
        {
            label: 'Terminais terrestres',
            child: {
                source: 'landTerminal'
            }
        },
        {
            label: 'Terminais marítimos',
            child: {
                source: 'seaTerminal'
            }
        },
        {
            label: 'Empresas',
            child: {
                source: 'Companies'
            }
        },
        {
            label: 'Pessoas',
            child: {
                source: 'Persons'
            }
        },
    ]
};

 
function preProcessTree() {
    function processNode(subTree: any, counter: any) {
        if (!subTree)
            return;
        subTree.id = counter.value++;
        
        if(subTree.source) {
            const opts = TableQueries.queries[subTree.source];
            if(opts)
                subTree.fields = opts.fields;
             else
                console.log('missing: ', subTree.source);
        }
        
        if (subTree.children) {
            for (var i = 0; i < subTree.children.length; i++)
                processNode(subTree.children[i], counter);
        } else if (subTree.child) {
            processNode(subTree.child, counter);
        }
    }

    var counter = { value: 1 };
    processNode(tree, counter);
}

preProcessTree();

export = tree; 