exports.constructDynamoPostParamsFrom = (req, images, tableName) => {
    return {
        TableName: tableName,
        Item: {
            Name: req.body.name,
            Date: req.body.date,
            Comments: req.body.comments,
            Images: images
        }
    }
}

exports.constructDynamoPatchParamsFrom = (req, tableName) => {
    return {
        TableName: tableName,
        Key: {
            Name: req.body.name,
            Date: req.body.date
        },
        UpdateExpression: 'set #c = :c',
        ExpressionAttributeNames: {'#c' : 'Comments'},
        ExpressionAttributeValues: {
            ':c' : req.body.comments
        }
    }
}

exports.constructDynamoDeleteParamsFrom = (req, tableName) => {
    return {
        TableName : tableName,
        Key: {
          'Name': req.params.name,
          'Date': req.params.date,
        }
      };
}

exports.constructDynamoGetParamsFrom = (req, tableName) => {
    return {
        TableName : tableName,
        Key: {
          'Name': req.params.name,
          'Date': req.params.date,
        }
      };
}