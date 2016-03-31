import BaseDataSourceParams = require('./BaseDataSourceParams');

const Well: BaseDataSourceParams = {
    fields: {
        name: {
            label: "Poço"
        },
        operator_name: {
            label: "Operador"
        },
        operator_id: {
            label: "Operador"
        },
        state: {
            label: "Estado"
        },
        basin_id: {
            label: "Bacia"
        },
        basin_name: {
            label: "Bacia"
        },
        lat: {
            label: "Latitude"
        },
        lng: {
            label: "Longitude"
        },
        block_name: {
            label: "Bloco"
        },
        block_id: {
            label: "Bloco"
        },
        drilling_rig_onshore_id: {
            label: "Sonda"
        },
        drilling_rig_offshore_id: {
            label: "Sonda"
        }
    },
    labelField: "name",
    gridFields: ["name", "operator_name", "state", "basin_name"],
    tableLabel: "Poços",
    hasMap: true,
    excelParams: {
        keyField: "poco",
        fields: {
            poco: 'name',
            operadora: 'operator',
            estado: 'state',
            bacia: 'basin',
            bloco: 'block',
            latitude_dd: 'lat',
            longitude_dd: 'lng'
        }
    }
}

export = Well;