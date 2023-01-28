const express = require('express');
const app = express();

const AWS = require('aws-sdk');
const awsConfig = require('./awsConfig');

AWS.config.update({
    region: awsConfig.region,
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Places';

app.use('/api/v1/dummyPopulate', async (req, res, next) => {
    const params = {
        TableName: tableName,
        Item: {
            Name: 'Test title',
            Date: '1/28/2023',
            Comments: 'config file works'
        }
    }
    
    dynamodb.put(params, (err,data) => {
        if(!err){
            res.status(200).json(data);
        }
        if (err) {
            res.status(400).json(err);
        }
    });
});

app.use('/api/v1/test', (req, res, next) => {
    const testResponse = {
        name: 'test',
        value: 'successful'
    }
    res.status(200).json(testResponse);
});

module.exports = app;