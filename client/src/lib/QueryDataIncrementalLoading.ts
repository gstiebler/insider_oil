import { getP } from './Server';
import * as ni from '../../../common/NetworkInterfaces';
import { IFilter } from '../../../common/Interfaces';
import * as Promise from 'bluebird';

export class QueryDataIncrementalLoading {

    private itemsPerPage: number;
    private queryName: string;
    private waitingData: boolean;
    private count: number;
    private filters: IFilter[];
    private records: any[];

    constructor(queryName: string, itemsPerPage: number) {
        this.queryName = queryName;
        this.itemsPerPage = itemsPerPage;

        this.waitingData = false;
        this.filters = [];

        this.count = 9999999;
        this.records = [];
    }

    public getData():Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            if(this.waitingData || (this.records.length >= this.count)) {
                return;
            }
            const req: ni.GetTableQueryData.req = {
                queryName: this.queryName,
                queryParams: {
                    order: [], 
                    filters: this.filters,
                    pagination: {
                        first: this.records.length,
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

    public search(filter: IFilter):Promise<any[]>  {
        this.count = 9999999;
        this.records = [];

        if(filter.like == '') {
            this.filters = [];
        } else {
            this.filters = [filter];
        }
        return this.getData();
    }
    
    public onData(resolve, data:ni.GetTableQueryData.res) {
        this.count = data.count;
        this.records = this.records.concat(data.records);
        this.waitingData = false;
        resolve(this.records);
        return null;
    }
}