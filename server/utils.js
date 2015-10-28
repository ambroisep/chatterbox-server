var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10,
  'Content-Type': 'application/json'
};

exports.sendResponse = function(response, data, params) {
  params = params || {},
  statusCode = params.statusCode || 200;
  encoding = params.encoding || 'utf-8';
  headers['Content-Type'] = params.contentType || 'application/json';
  response.writeHead(statusCode, headers);
  response.end(data, encoding);
};

exports.collectData = function(request, callback) {
  var data = '';
  request.on('data', function(chunk) {
    data += chunk.toString();
  });
  request.on('end', function() {
    callback(data);
  });
};

// exports.makeActionHandler = function(actionMap) {
//   return function(request, response) {
//     var action = actionMap[request.method];
//     if (action) {
//       action(request, response);
//     } else {
//       exports.sendResponse(response, '', 404);
//     }
//   }
// };

