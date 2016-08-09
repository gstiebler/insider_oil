"use strict";

import * as AWS from 'aws-sdk';

export function saveImage(content, fileName:string):Promise<string> {
    return new Promise((resolve, reject) => {
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