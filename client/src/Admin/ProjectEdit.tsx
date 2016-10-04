import * as React from 'react';
import * as server from '../lib/Server';
import * as showError from '../lib/ShowError';
import * as ModelOperations from '../lib/ModelOperations';
import * as ModelViewService from '../lib/ModelViewUtils';
import { browserHistory } from 'react-router';
import { AdminRecordFields } from './AdminRecordFields';
import { IField } from '../../../common/Interfaces';
import * as Flash from '../Flash'
import * as ni from '../../../common/NetworkInterfaces';
import * as AdminEdit from './AdminEdit';

interface IAppProps {
    location: any;
}

interface IAppState extends AdminEdit.IAppState {
}

export class ProjectEdit extends AdminEdit.AdminEdit {

    constructor(props: IAppProps) {
        super(props);

        this.state.modelName = 'Project';
    }

}