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
    News: BaseDataSourceOperations,
    OilField: BaseDataSourceOperations,
    OilFieldDeveloping: BaseDataSourceOperations,
    OilFieldProduction: BaseDataSourceOperations,
    Person: BaseDataSourceOperations,
    Production: BaseDataSourceOperations,
    Reserve: BaseDataSourceOperations,
    ReserveProvenOil: BaseDataSourceOperations,
    ReserveProvenGas: BaseDataSourceOperations,
    ReserveTotalOil: BaseDataSourceOperations,
    ReserveTotalGas: BaseDataSourceOperations,
    Seismic: BaseDataSourceOperations,
    Well: Well,
    HydrocarbonEvidence: BaseDataSourceOperations,
    ProductionUnit: BaseDataSourceOperations,
    ProductionWell: BaseDataSourceOperations,
    Refinery: BaseDataSourceOperations,
    Terminal: BaseDataSourceOperations,
    Fleet: BaseDataSourceOperations,
    Bid: BaseDataSourceOperations,
    Contract: BaseDataSourceOperations,
    GasPipeline: BaseDataSourceOperations,
    OilPipeline: BaseDataSourceOperations,
    GasMovement: BaseDataSourceOperations,
    IndustrySegment: BaseDataSourceOperations,
};

export = operations;