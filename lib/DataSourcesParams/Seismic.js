exports.Seismic = {
    fields: {
        process: {
            label: "Processo"
        },
        authorized_company: {
            label: "Empresa autorizada"
        },
        dou_publi_date: {
            label: "Publicação no DOU"
        },
        end_date: {
            label: "Validade"
        },
        authorized_technologies: {
            label: "Tecnologias autorizadas"
        },
        basin: {
            label: "Bacia sedimentar"
        }
    },
    labelField: "process",
    gridFields: ["process", "authorized_company", "dou_publi_date", "end_date", "authorized_technologies", "basin"],
    tableLabel: "Sísmicas",
    hasMap: false
}