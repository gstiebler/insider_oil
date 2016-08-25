"use strict";
var cheerio = require('cheerio');
import db = require('../db/models');
import * as AWS from '../lib/AWS';

interface INewsModelRef {
	model: string;
	id: string;
}

function getLinkParameters(linkStr):INewsModelRef {
	const regex = /\/app\/view_record\?source=([a-zA-Z ]+)\&id=([0-9\.]+)/
	const results = linkStr.match(regex);
	if(!results || results.length < 2)
		return null;
	const result = {
		model: results[1],
		id: results[2]
	}
	return result;
}


export function getModelReferences(htmlText: string): INewsModelRef[] {
	const parsedHtml = cheerio.load(htmlText);

	const obj = parsedHtml('a');
	const aHrefs = obj.map(function(i) {
	  return parsedHtml(this).attr('href');
	}).get();
	
	const result: INewsModelRef[] = [];
	for(var i = 0; i < aHrefs.length; i++) {
		const parameters = getLinkParameters(aHrefs[i]);
		if(parameters)
			result.push(parameters);
	}

	return result;
}

export function formatImgUrl(id:number, size?:string):string {
	let result = 'insights/';
	if(size) {
		result += size + '/';
	}
	result += AWS.fileNameById(id);
    return result;
}