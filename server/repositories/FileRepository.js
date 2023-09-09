import dbPool from '../db.js';
import aws from 'aws-sdk';
import { v4 as uuid } from 'uuid';

class FileRepository {
    constructor(dbPool, awsConfig){
        this.pool = dbPool;
        aws.config.update(awsConfig);
        this.s3 = new aws.S3();
    }

    async getSignedUrl(userId){
        const key = `${userId}/${uuid()}.jpeg`

        try {
        const url = await this.s3.getSignedUrlPromise('putObject', {
            Bucket: process.env.AWS_S3_BUCKET,
            ContentType: 'image/jpeg',
            Key: key
          });
            return url;
        } catch (err){
            console.error(err);
        }


    }

}

const awsConfig = {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    region: process.env.AWS_S3_REGION
};

export default new FileRepository(dbPool, awsConfig);

