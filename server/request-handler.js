var fs = require('fs');
var utils = require('./utils');

var db = [];
var responseBody;

var requestHandler = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);

  if(request.method === 'OPTIONS'){
    utils.sendResponse(response, null);
  }

  if(request.url.slice(0,9) === '/classes/'){
    roomName = request.url.slice(9).split('?')[0];
    if (request.method === 'POST') {
      var json = '';
      var dateTime = Date.now();
      request.on('data', function(datum){
        json += datum.toString();
      });
      request.on('end', function() {
        json = JSON.parse(json);
        json.createdAt = dateTime;
        json.objectId =dateTime;
        db.push(json);
        responseBody = JSON.stringify(json);
        utils.sendResponse(response, responseBody, 201);
      });
    } else if (request.method === 'GET') {
      responseBody = JSON.stringify({results: db});
      utils.sendResponse(response, responseBody);
    } 
  } else if(request.url === '/') {
    readFile('./client/refactor.html', response);
  } else {
    readFile('./client' + request.url, response);
  } 

};

module.exports.requestHandler = requestHandler;

var readFile = function(fileName, response){
  fs.readFile(fileName, function(error, content) {
    if (error) {
      console.log('pb')
      utils.sendResponse(response, JSON.stringify('File not found'), {statusCode: 400})
    }
    else {
      var contentType;
      var encoding = 'utf-8';
      console.log('ok')
      ext = fileName.split('.')[2];
      if (ext === 'js') {
        contentType = 'text/javascript';
      } else if (ext === 'css') {
        contentType = 'text/css';
      } else if (ext === 'html') {
        contentType = 'text/html';
      } else if (ext === 'gif') {
        contentType = 'image/gif';
        encoding = 'binary'
      }
      responseBody = content;
      utils.sendResponse(response, responseBody, {contentType: contentType, encoding: encoding})
      return;
    }
  });
}
