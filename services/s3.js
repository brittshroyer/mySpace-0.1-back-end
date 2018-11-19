var aws = require('aws-sdk'),
    ASQ = require('asynquence-contrib');

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY, // id
    AWS_SECRET_KEY = process.env.AWS_SECRET_KEY, // secret
    S3_BUCKET = process.env.S3_BUCKET;

var getSignedUrlListObjects = function(filePath) {
  aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
  var s3 = new aws.S3();
  var s3Params = {
      Bucket: S3_BUCKET,
      Delimiter: '/',
      Prefix: filePath,
      Expires: 60
  };

  return ASQ(function _getSignedUrl(done) {
    s3.getSignedUrl('listObjects', s3Params, function(err, data) {
      if (err) {
        done.fail(err);
      } else {
        var returnData = {
          signed_request: data
        };
        done(returnData);
      }
    });
  });

};

// For uploads (both misc and logos)
var getSignedUrl = function(filePath, fileType) {
  fileType.toString();
  key = "images/" + filePath;
  console.log('key', key);
  aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
  var s3 = new aws.S3();
  var s3Params = {
      Bucket: S3_BUCKET,
      Key: key,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
  };

  return ASQ(function _getSignedUrl(done) {
    console.log('getting here');
    s3.getSignedUrl('putObject', s3Params, function(err, data) {
      if (err) {
        done.fail(err);
      } else {
        var returnData = {
          signed_request: data,
          url: 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + key
        };
        console.log('returnData', returnData);
        done(returnData);
      }
    });
  });

};

var getObject = function(filePath) {
  aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
  var s3 = new aws.S3();
  var s3Params = {
      Bucket: S3_BUCKET,
      Key: filePath
  };

  return ASQ(function _getSignedUrl(done) {
    s3.getSignedUrl('getObject', s3Params, function(err, data) {
      if (err) {
        done.fail(err);
      } else {
        var returnData = {
          signed_request: data,
          url: 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + filePath
        };
        done(returnData);
      }
    });
  });
};

var copyObject = function(key, id, newFileName) {
  aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});

  var s3 = new aws.S3();
  var copySource = '/' + S3_BUCKET + '/user-files/' + id + '/' + key;
  var destinationKey = 'user-files/' + id + '/' + newFileName;
  var destinationBucket = S3_BUCKET;
  var s3Params = {
      Bucket: destinationBucket,
      Key: destinationKey,
      CopySource: copySource
  };

  return ASQ(function _copyS3Object(done) {
    s3.copyObject(s3Params, function(err, data) {
      if (err) {
        done.fail(err);
      } else {
        return done(data);
      }
    });
  });
};

var deleteObject = function(key, id, prefix) {
  aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
  var s3 = new aws.S3();
  var s3Params = {
      Bucket: S3_BUCKET,
      Key: prefix + id + '/' + key
  };

  return ASQ(function _deleteObject(done) {
    s3.deleteObject(s3Params, function(err, result) {
      if(err){
        done.fail(err);
      } else {
        done(result);
      }
    });
  });
};

var isImage = function(fileName) {
  var fileExt = fileName.split('.').pop();
  return _.includes(['jpg', 'jpeg', 'png', 'gif'], fileExt.toLowerCase());
};

var isPdf = function(fileName) {
  var fileExt = fileName.split('.').pop();
  return _.includes(['pdf'], fileExt.toLowerCase());
};

module.exports = {
  getSignedUrl: getSignedUrl,
  deleteObject: deleteObject,
  isImage: isImage,
  isPdf: isPdf,
  getObject: getObject,
  getSignedUrlListObjects: getSignedUrlListObjects,
  copyObject: copyObject
};
