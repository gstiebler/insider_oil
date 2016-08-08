import * as React from 'react';

interface IAppProps {
    data: string[];
    onChange: any;
}

interface IAppState {
}

export class ReorderableList extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);

        this.state = {
        };
    }

    private allowDrop(ev) {
        ev.preventDefault();
    }

    private drag(data, ev) {
        ev.dataTransfer.setData("text", data);
        console.log('drag', data);
    }

    private drop(i, ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        const items = this.props.data;
        const indexToRemove = items.indexOf(data);
        // remove from previous position
        items.splice(indexToRemove, 1);
        // add to new position
        items.splice(i, 0, data);
        console.log('drop', items);
        //ev.target.appendChild(document.getElementById(data));
    }

    public render(): React.ReactElement<any> {
        const listItems = this.props.data.map((item, i) => {
            return <li className="list-group-item" 
                       draggable="true"
                       onDragStart={this.drag.bind(this, item)} 
                       onDrop={this.drop.bind(this, i)} 
                       onDragOver={this.allowDrop}
                       key={i} >{item}</li>
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