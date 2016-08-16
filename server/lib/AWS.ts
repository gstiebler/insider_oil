"use strict";

import * as AWS from 'aws-sdk';

export function saveImage(content: Buffer, fileName:string):Promise<string> {
    return new Promise((resolve, reject) => {
        if(process.env.NODE_ENV != 'production') {
            fileName = process.env.NODE_ENV + '/' + fileName;
        }
        const params = {Bucket: 'insider-oil', Key: fileName};
        var s3:any = new AWS.S3({ params });
        s3.getBucketAcl(function(err) {
            if (err) { 
                reject(err); 
            } else {
                const uploadParams = {
                    Body: content,
                    ACL: 'public-read',
                    ContentEncoding: 'image/jpeg',
                };
                s3.upload(uploadParams, function() {
                    resolve('ok');
                });
            }
        });
    });
} 