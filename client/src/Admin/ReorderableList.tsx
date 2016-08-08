import * as React from 'react';
import { IInsight } from '../../../common/Interfaces';

interface IAppProps {
    data: IInsight[];
    listName: string;
    onChange: any;
}

interface IAppState {
    data: IInsight[];
}

export class ReorderableList extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            data: this.props.data
        };
    }

    private allowDrop(ev) {
        ev.preventDefault();
    }

    private drag(insight, ev) {
        ev.dataTransfer.setData("text", JSON.stringify(insight));
    }

    private drop(objIndex, ev) {
        ev.preventDefault();
        const insightStr = ev.dataTransfer.getData("text");
        const insight:IInsight = JSON.parse(insightStr);
        const items = this.state.data;
        // remove from previous position
        for(var i = 0; i < items.length; i++) {
            if(items[i].id == insight.id) {
                items.splice(i, 1);
                break;
            }
        }
        // add to new position
        items.splice(objIndex, 0, insight);
        this.props.onChange(this.props.listName, items);
        this.state.data = items;
        this.setState(this.state);
    }

    public render(): React.ReactElement<any> {
        const listItems = this.state.data.map((item, i) => {
            return <li className="list-group-item" 
                       draggable="true"
                       onDragStart={this.drag.bind(this, item)} 
                       onDrop={this.drop.bind(this, i)} 
                       onDragOver={this.allowDrop}
                       key={i} >{item.id + ' - ' + item.title}</li>
        });	

		return (
            <div>
                <div style={{ width: 300 }}>
                    <ul className="list-group">
                        { listItems }
                    </ul>
                </div>
            </div>);
    }
}