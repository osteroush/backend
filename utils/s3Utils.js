/*
constructs a Key which uses the Name field in the
Place Table in Dynamo, along with the index, and
maintains the original file extention.
The Key will match the Name field in Dynamo. 
'Tap Room on 19th' and 2 picture: 
pxl0326.jpg
iphotojuly7th.png
becomes
TapRoomon19th0.jpg
TapRoomon19th1.png
*/
exports.constructs3KeyFrom = (req, file, index) => {
    const lastPeriodIndex = file.originalname.lastIndexOf('.');
    const fileExtension = file.originalname.slice(lastPeriodIndex);
    const key = req.body.name.replaceAll(/\s/g,'') + index + fileExtension;
    return key;
}

/*
Reads the File into a Buffer and returns it with
the rest of the params needed for putting the 
images into the s3 bucket. 
The record in Dynamo for the Place will have 
an array, images[], with the Keys for the images
that correspond to that Place.
*/
exports.constructs3ParamsFrom = (file, key) => {
    return {
        Body: Buffer.from(file.buffer),
        Bucket: 'osteroushimages',
        Key: key
    }
}
