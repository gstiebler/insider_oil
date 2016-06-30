import * as React from 'react';
import * as server from './lib/Server';
import * as showError from './lib/ShowError';
import { Link, browserHistory } from 'react-router';
import { PaginatedTable } from './PaginatedTable';

interface IAppProps {
    location: any;
}

interface IAppState {
    items: any[];
    tableParams: any;
    nodeId: number;
    nodeLabel: string;
    stack: any[];
}

export class Tree extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = { 
            items: [],
            tableParams: null,
            nodeId: props.location.query.nodeId,
            nodeLabel: props.location.query.nodeLabel,
            stack: []
        };

        server.getTree(this.showTree.bind(this), showError.show);
    }

    private makeItem(subTree) {
        return {
            label: subTree.label,
            id: subTree.id
        };
    }
    
    private findItem(tree, stack) {
        if(tree.id == this.state.nodeId || tree.label == this.state.nodeLabel) {
            stack.push( this.makeItem(tree) );
            return tree;
        }
            
        if(tree.children) {
            for(var i = 0; i < tree.children.length; i++) {
                var result = this.findItem(tree.children[i], stack);
                if(result) {
                    stack.push( this.makeItem(tree) );
                    return result;
                }
            }
        } 
        
        return false;
    }
    
    private showTree(tree) {
        var stack = [];
        var subTree = this.findItem(tree, stack);
        stack.reverse();
        this.state.stack = stack;
        if(!subTree) {
            var errorObj = { data: { errorMsg: 'Item da árvore não encontrado' } };
            showError.show(errorObj);
            return;
        }
        if(subTree.children) {
            // show children categories
            this.state.items = subTree.children;
            this.state.tableParams = null;
        } else if (subTree.child) {
            this.showObjectsFromCategory(subTree);
        } else {
            var errorObj = { data: { errorMsg: 'Item da árvore não encontrado' } };
            showError.show(errorObj);
        }
        this.setState(this.state);
    }
    
    private showObjectsFromCategory(subTree) {
        this.state.tableParams = {
            label: subTree.label,
            fields: subTree.child.fields,
            source: subTree.child.source  
        };
        this.setState(this.state);
    }

    private componentWillReceiveProps(nextProps) {
        this.state = { 
            items: [],
            tableParams: null,
            nodeId: nextProps.location.query.nodeId,
            nodeLabel: nextProps.location.query.nodeLabel,
            stack: []
        };

        server.getTree(this.showTree.bind(this), showError.show);
    } 

    public render(): JSX.Element {
        var stackh = this.state.stack.map( (item) => {
            var linkStr = "/app/tree?nodeId=" + item.id;
            return (                
                <span key={item.label}>
                    > <Link to={ linkStr }>{item.label}</Link>
                </span>
            );
        });

        var treeItems = this.state.items.map( (item) => {
            var linkStr = "/app/tree?nodeId=" + item.id;
            return ( <p key={item.label}> <Link to={ linkStr }>{item.label}</Link> </p> );
        });

        return (
            <div>
                <h1>Dados</h1>
                <br/>
                <div>{ stackh }</div>
                <br/><br/>
                <div>{ treeItems }</div>
                { this.state.tableParams ? (<PaginatedTable tableParams={ this.state.tableParams } ></PaginatedTable>) : null }
            </div>
        );
    }
}