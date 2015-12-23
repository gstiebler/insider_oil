'use strict';

var tree = { 
label: "Oil & Gas"
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