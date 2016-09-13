import * as cheerio from 'cheerio';
import * as request from 'request';

const names = [
    ['lblNome', 'Nome'],
    ['lblIncricao', 'Inscrição'],
    ['lblIMO', 'IMO'],
    ['lblREB', 'REB'],
    ['lblTipo', 'Tipo de embarcação '],
    ['lblTEU', 'TEU'],
    ['lblCapacidadePassageiro', 'Capacidade de passageiros'],
    ['lblBHP', 'BHP'],
    ['lblTTE', 'TTE'],
    ['lblArqueacaoBruta', 'Arqueação bruta'],
    ['lblComprimento', 'Comprimento'],
    ['lblCalado', 'Calado'],
    ['lblIRIN', 'IRIN'],
    ['lblTribunalMaritimo', 'Registro no tribunal marítimo'],
    ['lbTipoNavegacao', 'Tipo de navegação'],
    ['lblTPB', 'TPB'],
    ['lblAnoConstrucao', 'Ano de construção'],
    ['lblMotor', 'Qtde motores'],
    ['lblSituacao', 'Situação'],
    ['lblArqueacaoLiquida', 'Arqueação líquida'],
    ['lblBoca', 'Boca'],
    ['lblNatureza', 'Natureza ou Tipo de Carga'],
    ['lnkProprietaria', 'Empresa proprietária'],
    ['lnkOperadora', 'Empresa operadora'],
];

function requestSync(url):Promise<any> {
    return new Promise<any>((resolve, reject) => {
        request(url, function (error, response, body) {
            if(error || response.statusCode != 200) {
                reject(error);
            }
            else {
                const parsedHtml = cheerio.load(body);
                resolve(parsedHtml);
            };
        })
    });
}

async function process() {
    for(var i = 0; i < 10; i++) {
        const url = 'http://www.antaq.gov.br/Portal/Frota/ExibirEmbarcacao.aspx?id=' + i;
        let parsedHtml = await requestSync(url);

        const msg:string = parsedHtml('#lblMensagem').text();
        if(msg.indexOf('A embarcação não foi encontrada.') > -1) {
            continue;
        }

        console.log('Índice:', i);
        for(let spanName of names) {
            console.log(spanName[1]);
            console.log(parsedHtml('#' + spanName[0]).text());
        }
    }
}

process();
