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
            label: 'Logística',
            children: [
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
                    label: 'Frota Transpetro',
                    child: {
                        source: 'Fleet'
                    }
                },
                {
                    label: 'Gasodutos',
                    child: {
                        source: 'GasPipelines'
                    }
                },
                {
                    label: 'Oleodutos',
                    child: {
                        source: 'OilPipelines'
                    }
                },
            ]
        },
        {
            label: 'Refinarias',
            child: {
                source: 'Refineries'
            }
        },*/
        {
            label: 'Licitações',
            child: {
                source: 'Bids'
            }
        },
        {
            label: 'Contratos',
            child: {
                source: 'Contracts'
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
        {
            label: 'Projetos',
            child: {
                source: 'Projects'
            }
        },
        {
            label: 'Notícias',
            child: {
                source: 'News'
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