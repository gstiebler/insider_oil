import { getP } from './Server';
import * as ni from '../../../common/NetworkInterfaces';
import * as Promise from 'bluebird';

export class QueryDataIncrementalLoading {

    private itemsPerPage: number;
    private queryName: string;
    private lastItem: number;
    private waitingData: boolean;
    private count: number;

    constructor(queryName: string, itemsPerPage: number) {
        this.queryName = queryName;
        this.itemsPerPage = itemsPerPage;

        this.lastItem = 0;
        this.waitingData = false;
        this.count = 9999999;
    }

    public getData():Promise<ni.GetTableQueryData.res> {
        return new Promise<ni.GetTableQueryData.res>((resolve, reject) => {
            if(this.waitingData || (this.lastItem >= this.count)) {
                return;
            }
            const req: ni.GetTableQueryData.req = {
                queryName: this.queryName,
                queryParams: {
                    order: [], 
                    filters: [],
                    pagination: {
                        first: this.lastItem,
                        itemsPerPage: this.itemsPerPage
                    }
                }
            }
            this.waitingData = true;
            getP('/get_table_data', req)
                .then(this.onData.bind(this, resolve))
                .catch(reject);
        });
    }    
    
    public onData(resolve, data:ni.GetTableQueryData.res) {
        this.count = data.count;
        this.lastItem += this.itemsPerPage;
        this.waitingData = false;
        resolve(data);
        return null;
    }
}