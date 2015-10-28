var fs =require('fs');
var statusCode = 200;
var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10
};
var db = [];
var responseBody;

var requestHandler = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  if(request.method === 'OPTIONS'){
    response.writeHead(200, headers);
    response.end();
  }

  if(request.url.slice(0,9) === '/classes/'){
    roomName = request.url.slice(9).split('?')[0];
    headers['Content-Type'] = 'application/json';

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
        statusCode = 201;
        responseBody = JSON.stringify(json);
        response.writeHead(statusCode, headers);
        response.end(responseBody);
      });
    } else if (request.method === 'GET') {
      statusCode = 200;
      responseBody = JSON.stringify({results: db});
      response.writeHead(statusCode, headers);
      response.end(responseBody);
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
      statusCode = 400;        
      response.writeHead(statusCode, headers);
      response.end('test', 'utf-8');
    }
    else {
      var contentType;
      var encoding = 'utf-8';
      console.log('ok')
      statusCode = 200;
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
      headers['Content-Type'] = contentType;
      responseBody = content;
      response.writeHead(statusCode, headers);
      response.end(responseBody, encoding);
      return;
    }
  });
}
