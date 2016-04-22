
interface ITreeChild {
    source: string;
    filters?: any;
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
                        source: 'Block'
                    }
                },
                {
                    label: 'Poços',
                    child: {
                        source: 'Well'
                    }
                },
                {
                    label: 'Sondas',
                    children: [
                        {
                            label: 'Offshore',
                            child: {
                                source: 'DrillingRigOffshore'
                            }
                        },
                        {
                            label: 'Onshore',
                            child: {
                                source: 'DrillingRigOnshore'
                            }
                        }
                    ]
                },
                {
                    label: 'Sísmica',
                    children: [
                        {
                            label: 'Autorizações',
                            child: {
                                source: 'Seismic'
                            }
                        },
                        {
                            label: 'Licenças ambientais',
                            child: {
                                source: 'AmbientalLicense'
                            }
                        }
                    ]
                },
            ]
        },
        {
            label: 'Produção',
            children: [
                {
                    label: 'Onshore',
                    children: [
                        {
                            label: 'Campos em fase de desenvolvimento',
                            child: {
                                source: 'OilFieldDeveloping',
                                filters: {
                                    shore: 'on'
                                }
                            }
                        },
                        {
                            label: 'Campos em fase de produção',
                            child: {
                                source: 'OilFieldProduction',
                                filters: {
                                    shore: 'on'
                                }
                            }
                        }
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
                                        /* TODO must have a field for this filter
                                        filters: {
                                            status: 'operation'
                                        }*/
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
                                        /* TODO must have a field for this filter
                                        filters: {
                                            status: 'operation'
                                        }*/
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
            label: 'Pessoas',
            child: {
                source: 'Person'
            }
        },
        {
            label: 'Empresas',
            child: {
                source: 'Company'
            }
        },
        {
            label: 'Notícias',
            child: {
                source: 'News'
            }
        }
        /*,
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
        }*/
    ]
};

 
function addNumbers() {
    function enumerateSubTree(subTree: any, counter) {
        if (!subTree)
            return;
        subTree.id = counter.value++;
        if (subTree.children) {
            for (var i = 0; i < subTree.children.length; i++)
                enumerateSubTree(subTree.children[i], counter);
        } else if (subTree.child) {
            enumerateSubTree(subTree.child, counter);
        }
    }

    var counter = { value: 1 };
    enumerateSubTree(tree, counter);
}

addNumbers();

export = tree; 