import * as React from 'react';
import { IInsight } from '../../../../common/Interfaces';

export function removeById(array, id) {
    for(var i = 0; i < array.length; i++) {
        if(array[i].id == id) {
            array.splice(i, 1);
            break;
        }
    }
}

export function allowDrop(ev) {
    ev.preventDefault();
}

interface IAppProps {
    data: IInsight[];
    listName: string;
    onChange: any;
}

interface IAppState {
    data: IInsight[];
}

export class InsightsReorderableList extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            data: this.props.data
        };
    }

    private drag(insight, ev) {
        insight.source = this.props.listName;
        ev.dataTransfer.setData("text", JSON.stringify(insight));
    }

    private dropOnItem(objIndex, ev) {
        ev.preventDefault();
        const insightStr = ev.dataTransfer.getData("text");
        const insight:IInsight = JSON.parse(insightStr);
        const items = this.state.data;
        // remove from previous position
        removeById(items, insight.id);
        // add to new position
        items.splice(objIndex, 0, insight);
        this.props.onChange(this.props.listName, items);
        this.state.data = items;
        this.setState(this.state);
    }

    private dropOnPlus(ev) {
        ev.preventDefault();
        const insightStr = ev.dataTransfer.getData("text");
        const insight:IInsight = JSON.parse(insightStr);
        const items = this.state.data;
        // remove from previous position
        removeById(items, insight.id);
        // add to new position
        items.push(insight);
        this.props.onChange(this.props.listName, items);
        this.state.data = items;
        this.setState(this.state);
    }

    public render(): React.ReactElement<any> {
        const listItems = this.state.data.map((item, i) => {
            return <li className="list-group-item" 
                       draggable="true"
                       onDragStart={this.drag.bind(this, item)} 
                       onDrop={this.dropOnItem.bind(this, i)} 
                       onDragOver={allowDrop}
                       key={i} >{item.title}</li>
        });	

		return (
            <div>
                <div style={{ width: 300 }}>
                    <ul className="list-group">
                        { listItems }
                    </ul>
                    <img src="images/plus.png" alt=""
                        onDragOver={allowDrop}
                        onDrop={this.dropOnPlus.bind(this)}/>
                </div>
                <br/>
            </div>);
    }
}