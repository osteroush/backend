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

app.post('/BackEnd/api/v1/place', multer().any(), async (req, res) => {
    const images = [];
    try {
        const imageurls = await s3Utils.uploadImagesTos3(req, s3);
        images.push(...imageurls);
    } catch (error) {
        res.status(400).json({message: 'error encountered when uploading images.', error: error});
    }

    try {
        const params = dynamoUtils.constructDynamoPostParamsFrom(req, images, tableName);
        const response = await dynamodb.put(params).promise();
        response.success = true;
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({message: 'error encountered when uploading to dynamo.', error: error});
    }    
});

app.patch('/BackEnd/api/v1/place', multer().any(), async (req, res) => {

    try {
        await s3Utils.deleteImagesFroms3(req.body.imagesToDelete, s3);
    } catch (error) {
        res.status(400).json({message: 'error encountered when updating images.', error: error});
    }

    const images = [];
    try {
        const imageurls = await s3Utils.uploadImagesTos3(req, s3);
        images.push(...imageurls);
    } catch (error) {
        res.status(400).json({message: 'error encountered when uploading images.', error: error});
    }

    try {
        const params = dynamoUtils.constructDynamoPatchParamsFrom(req, images, tableName);
        const response = await dynamodb.update(params).promise();
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({message: 'error encountered when uploading to dynamo.', error: error});
    }
});

app.get('/BackEnd/api/v1/places/:year', async (req, res) => {
    try {
        const params = dynamoUtils.constructDynamoGetPlacesParamsFrom(req, tableName);
        const dynamoResponse = await dynamodb.scan(params).promise();
        res.status(200).json(dynamoResponse);
    } catch (error) {
        res.status(400).json({message: 'error encountered when getting places', error: error});  
    }
});

app.get('/BackEnd/api/v1/login/:user/:pass', async (req, res) => {
    try {
        const params = dynamoUtils.constructDynamoLoginParamsFrom(req);
        const dynamoResponse = await dynamodb.scan(params).promise();
        if(dynamoResponse != null && dynamoResponse.Items != null && dynamoResponse.Items.length > 0){
            res.status(200).json({login:true});
        } else {
            res.status(200).json({login:false});
        }
    } catch (error) {
        res.status(400).json({message: 'error encountered when logging in', error: error});        
    }
});

app.delete('/BackEnd/api/v1/place/', async (req, res) => {
    if(req.body?.Images?.length > 0) {
        try {
            await s3Utils.deleteImagesFroms3(req.body.Images, s3);
        } catch (error) {
            res.status(400).json({message: 'error encountered when deleting images.', error: error});
        }
    }
    try {
        const params = dynamoUtils.constructDynamoDeleteParamsFrom(req, tableName);
        const deleteResponse = await dynamodb.delete(params).promise();
        deleteResponse.success = true;
        res.status(200).json(deleteResponse);
    } catch (error) {
        res.status(200).json(error);
    }
});

module.exports = app;