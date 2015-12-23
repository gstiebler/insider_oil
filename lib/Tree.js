'use strict';

var tree = { 
label: "Oil & Gas",
children: [
    {
        label: 'Exploração',
        children: [
            {
                label: 'Blocos'
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
                            source: 'DrillingRig',
                            filters: [
                                { 
                                    name: 'shore',
                                    value: 'on'
                                }
                            ]
                        }
                    },
                    {
                        label: 'Onshore',
                        child: {
                            source: 'DrillingRig',
                            filters: [
                                { 
                                    name: 'shore',
                                    value: 'off'
                                }
                            ]
                        }
                    }
                ]
            },
            {
                label: 'Sísmica',
                children: [
                    {
                        label: 'Autorizações'
                    },
                    {
                        label: 'Licenças ambientais'
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
                            source: 'Field',
                            filters: [
                                { 
                                    name: 'state',
                                    value: 'developing'
                                },
                                { 
                                    name: 'shore',
                                    value: 'on'
                                }
                            ]
                        }
                    },
                    {
                        label: 'Campos em fase de produção',
                            filters: [
                                { 
                                    name: 'state',
                                    value: 'production'
                                },
                                { 
                                    name: 'shore',
                                    value: 'on'
                                }
                            ]
                    }
                ]
            },
            {
                label: 'Offshore',
                children: [
                    {
                        label: 'Campos em fase de desenvolvimento',
                        child: {
                            source: 'Field',
                            filters: [
                                { 
                                    name: 'state',
                                    value: 'developing'
                                },
                                { 
                                    name: 'shore',
                                    value: 'off'
                                }
                            ]
                        }
                    },
                    {
                        label: 'Campos em fase de produção',
                        child: {
                            filters: [
                                { 
                                    name: 'state',
                                    value: 'production'
                                },
                                { 
                                    name: 'shore',
                                    value: 'off'
                                }
                            ]
                        }
                    }
                ]
            },
            {
                label: 'UEPs',
                children: [
                    {
                        label: 'FPSOs'
                    },
                    {
                        label: 'Fixas'
                    }
                ]
            },
            {
                label: 'Reservas Nacionais',
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
                label: 'Produção por poço/campo',
                children: [
                    {
                        label: 'Onshore'
                    },
                    {
                        label: 'Offshore'
                    }
                ]
            },
        ]
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
    }
]};


function addNumbers() {
    function enumerateSubTree(subTree, counter) {
        if(!subTree)
            return;
        subTree.id = counter.value++;
        if(subTree.children) {
            for(var i = 0; i < subTree.children.length; i++)
                enumerateSubTree(subTree.children[i], counter);
        } else if(subTree.child) {
            enumerateSubTree(subTree.child, counter);
        }
    }

    var counter = { value: 1 };
    enumerateSubTree(tree, counter);
}

addNumbers();
//console.log(JSON.stringify(tree, null, '  '));

module.exports = tree;