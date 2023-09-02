exports.constructDynamoPostParamsFrom = (req, images, tableName) => {
    let lastImageIndex = 0;
    if(images && images.length > 0) {
        lastImageIndex = images.length;
    }
    return {
        TableName: tableName,
        Item: {
            PlaceName: req.body.name,
            MonthVisited: req.body.month,
            YearVisited: req.body.year,
            Comments: req.body.comments,
            Images: images,
            LastImageIndex: lastImageIndex
        }
    }
}

exports.constructDynamoPatchParamsFrom = (req, images, tableName) => {
    return {
        TableName: tableName,
        Key: {
            PlaceName: req.body.name
        },
        UpdateExpression: 'set #c = :c, #i = :i',
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
            'PlaceName': req.body.PlaceName
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