/// <reference path="../typings/browser.d.ts"/>

declare var Router;

import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface IAppProps {
  model: string;
}

interface IAppState {
  editing?: string;
  nowShowing?: string
}


class TodoApp extends React.Component<IAppProps, IAppState> {

  public state : IAppState;

  constructor(props : IAppProps) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    var setState = this.setState;
    var router = Router({
      '/': setState.bind(this, {teste: 'guilherme'}),
      '/active': setState.bind(this, {teste: 'guilherme'}),
      '/completed': setState.bind(this, {teste: 'guilherme'})
    });
    router.init('/');
  }

  public handleNewTodoKeyDown(event : __React.KeyboardEvent) {
  }

  public toggleAll(event : __React.FormEvent) {
    var target : any = event.target;
    var checked = target.checked;
    this.props.model = 'teste';
  }

  public render() {
    return (
      <div> Guilherme 123 </div>
    );
  }
}

ReactDOM.render(
  <div />,
  document.getElementsByClassName('todoapp')[0]
);
