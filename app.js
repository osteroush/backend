const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();
app.use(cors());
app.use(express.json({limit: '50mb'}));

const AWS = require('aws-sdk');
const credentials = require('./credentials');
const awsConfig = credentials.awsCredentials;
const s3Config = credentials.s3Credentials;
const s3Utils = require('./utils/s3Utils');
const dynamoUtils = require('./utils/dynamoUtils');

AWS.config.update({
    region: awsConfig.region,
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Places';

const s3 = new AWS.S3({
    region: s3Config.bucketRegion,
    accessKeyId: s3Config.accessKeyId,
    secretAccessKey: s3Config.secretAccessKey
});

app.post('/api/v1/place', multer().any(), async (req, res, next) => {

    const images = [];
    try {
        const imageurls = await s3Utils.uploadImagesTos3(req, s3);
        images.push(...imageurls);
    } catch (error) {
        return res.status(400).json({message: 'error encountered when uploading images.'});
    }

    try {
        const params = dynamoUtils.constructDynamoPostParamsFrom(req, images, tableName);
        const response = await dynamodb.put(params).promise();
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({message: 'error encountered when uploading to dynamo.'});
    }    
});

app.patch('/api/v1/place', multer().any(), async (req, res) => {

    try {
        await s3Utils.deleteImagesFroms3(req.body.imagesToDelete, s3);
    } catch (error) {
        return res.status(400).json({message: 'error encountered when updating images.'});
    }

    const images = [];
    try {
        const imageurls = await s3Utils.uploadImagesTos3(req, s3);
        images.push(...imageurls);
    } catch (error) {
        return res.status(400).json({message: 'error encountered when uploading images.'});
    }

    try {
        const params = dynamoUtils.constructDynamoPatchParamsFrom(req, images, tableName);
        const response = await dynamodb.update(params).promise();
        res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({message: 'error encountered when uploading to dynamo.'});
    }
});

app.get('/api/v1/place/:name/:date', async (req, res) => {
    try {
        const params = dynamoUtils.constructDynamoGetParamsFrom(req, tableName);
        const dynamoResponse = await dynamodb.get(params).promise();
        res.status(200).json(dynamoResponse);
    } catch (error) {
        res.status(200).json(error);
    }
});

app.delete('/api/v1/place/:name/:date', async (req, res) => {
    try {
        const params = dynamoUtils.constructDynamoDeleteParamsFrom(req, tableName);
        const deleteResponse = await dynamodb.delete(params).promise();
        res.status(200).json(deleteResponse);
    } catch (error) {
        res.status(200).json(error);
    }
});

app.use('/api/v1/test', (req, res, next) => {
    const testResponse = {
        name: 'test',
        value: 'successful'
    }
    res.status(200).json(testResponse);
});

module.exports = app;