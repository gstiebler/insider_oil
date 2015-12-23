'use strict';

var tree = [
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
                label: 'Sísmica'
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
                                    value: 'off'
                                }
                            ]
                    }
                ]
            },
            {
                label: 'Offshore'
            },
            {
                label: 'UEPs'
            },
            {
                label: 'Reservas Nacionais'
            },
            {
                label: 'Produção por poço/campo'
            },
        ]
    },
    {
        label: 'Logística'
    },
    {
        label: 'Downstream'
    }
];


function addNumbers() {
    function enumerateSubTree(subTree, counter) {
        if(!subTree)
            return;
        for(item in subTree) {
            item.id = counter++;
            enumerateSubTree(item.children, counter);
        }
    }

    var counter = 1;
    enumerateSubTree(tree, counter);
}

console.log(tree);

module.exports = tree;