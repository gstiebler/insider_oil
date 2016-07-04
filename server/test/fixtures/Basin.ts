module.exports = function(db) {
    return db.models.Basin.bulkCreate([
        {
            name: 'Tucano Central'
        },
        {
            name: 'Acre'
        },
        {
            name: 'Alagoas'
        },
        {
            name: 'Almada'
        },
        {
            name: 'Amazonas'
        },
        {
            name: 'Barreirinhas'
        },
        {
            name: 'Camamu'
        },
        {
            name: 'Campos'
        },
        {
            name: 'Ceará'
        },
        {
            name: 'Espírito Santo'
        },
        {
            name: 'Foz do Amazonas'
        },
        {
            name: 'Jequitinhonha'
        },
        {
            name: 'Pará - Maranhão'
        },
        {
            name: 'Paraná'
        },
        {
            name: 'Parecis - Alto Xingu'
        },
        {
            name: 'Parnaíba'
        },
        {
            name: 'Pelotas'
        },
        {
            name: 'Pernambuco - Paraíba'
        },
        {
            name: 'Potiguar'
        },
        {
            name: 'Recôncavo'
        },
        {
            name: 'Santos'
        },
        {
            name: 'São Francisco'
        },
        {
            name: 'Sergipe'
        },
        {
            name: 'Solimões'
        },
        {
            name: 'Tucano Sul'
        }
    ]);
}