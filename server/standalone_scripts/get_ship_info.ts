import * as cheerio from 'cheerio';
import * as request from 'request';
var XLSX = require('xlsx');

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

function Workbook():void {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}

function writeCell(r: number, c: number, value: any, ws) {
    const cell:any = { 
        v: value,
        t: 's' 
    };
    const cell_ref = XLSX.utils.encode_cell({ c, r });
    ws[cell_ref] = cell;
}

async function process() {
    const wb = new Workbook();
    const ws = {};

    for(let j = 0; j < names.length; j++) {
        writeCell(0, j, names[j][1], ws);
    }   

    let validRows = 0;
    for(let i = 0; i < 10; i++) {
        const url = 'http://www.antaq.gov.br/Portal/Frota/ExibirEmbarcacao.aspx?id=' + i;
        let parsedHtml = await requestSync(url);

        const msg:string = parsedHtml('#lblMensagem').text();
        if(msg.indexOf('A embarcação não foi encontrada.') > -1) {
            continue;
        }

        validRows++;
        console.log('Índice:', i);
        for(let j = 0; j < names.length; j++) {
            const text = parsedHtml('#' + names[j][1]).text();
            writeCell(validRows, j, text, ws);
        }
    }

    

	const range = {
        s: {
            c: 0, 
            r: 0
        }, 
        e: {
            c: names.length, 
            r: validRows + 1 
        }
    };
    ws['!ref'] = XLSX.utils.encode_range(range)

    var ws_name = 'Pasta principal';

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };
    XLSX.writeFile(wb, 'test.xlsx');
}

process();
