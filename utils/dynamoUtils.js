exports.constructDynamoPostParamsFrom = (req, images, tableName) => {
    return {
        TableName: tableName,
        Item: {
            PlaceName: req.body.name,
            MonthVisited: req.body.month,
            YearVisited: req.body.year,
            Comments: req.body.comments,
            Images: images
        }
    }
}

exports.constructDynamoPatchParamsFrom = (req, images, tableName) => {
    return {
        TableName: tableName,
        Key: {
            PlaceName: req.body.name,
            DateVisited: req.body.date
        },
        UpdateExpression: 'set #c = :c',
        ExpressionAttributeNames: {
            '#c': 'Comments',
            '#i': 'Images'
        },
        ExpressionAttributeValues: {
            ':c': req.body.comments,
            ':i': images
        }
    }
}

exports.constructDynamoDeleteParamsFrom = (req, tableName) => {
    return {
        TableName: tableName,
        Key: {
            'PlaceName': req.params.name,
            'DateVisited': req.params.date,
        }
    };
}

exports.constructDynamoGetPlacesParamsFrom = (req, tableName) => {
    return {
        TableName: tableName,
        FilterExpression : 'YearVisited = :year',
        ExpressionAttributeValues : {':year' : req.params.year}
    };
}

exports.constructDynamoLoginParamsFrom = (req) => {
    return {
        TableName: 'Credentials',
        FilterExpression : 'Username = :user AND Password = :pass',
        ExpressionAttributeValues : {
            ':user': req.params.user,
            ':pass': req.params.pass
        }
    };
}