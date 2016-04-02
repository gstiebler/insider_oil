import IDataSourceOperations = require('./IDataSourceOperations');
import BaseDataSourceOperations = require('./BaseDataSourceOperations');
import Well = require('./Well');

interface IOperations {    
    [name: string]: IDataSourceOperations;
}

const operations: IOperations = {
    AmbientalLicense: BaseDataSourceOperations,
    Basin: BaseDataSourceOperations,
    Block: BaseDataSourceOperations,
    ComercialDeclaration: BaseDataSourceOperations,
    Company: BaseDataSourceOperations,
    DrillingRigOffshore: BaseDataSourceOperations,
    DrillingRigOnshore: BaseDataSourceOperations,
    FixedUEPProduction: BaseDataSourceOperations,
    FPSOProduction: BaseDataSourceOperations,
    News: BaseDataSourceOperations,
    OilField: BaseDataSourceOperations,
    OilFieldDeveloping: BaseDataSourceOperations,
    OilFieldProduction: BaseDataSourceOperations,
    Person: BaseDataSourceOperations,
    Production: BaseDataSourceOperations,
    ProductionOnshore: BaseDataSourceOperations,
    ProductionOffshore: BaseDataSourceOperations,
    Reserve: BaseDataSourceOperations,
    ReserveProvenOil: BaseDataSourceOperations,
    ReserveProvenGas: BaseDataSourceOperations,
    ReserveTotalOil: BaseDataSourceOperations,
    ReserveTotalGas: BaseDataSourceOperations,
    Seismic: BaseDataSourceOperations,
    Well: Well
};

export = operations;