const express = require('express');
const app = express();

app.use('/api/v1/test', (req, res, next) => {
    const testResponse = {
        name: 'test',
        value: 'successful'
    }
    res.status(200).json(testResponse);
});

module.exports = app;