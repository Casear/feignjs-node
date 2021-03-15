
var Args = require('args-js');
var _ = require('lodash');
var http = require('http');
var URL = require('url');



function FeignNodeClient(){
  var args  = Args([
      { defaults: Args.OBJECT | Args.Optional, _default: {}},
    ], arguments);

  
  this.defaults = args.defaults;
  
  
}

FeignNodeClient.prototype.request =  function(request){
  var options = this._createHttpOptions(request.baseUrl, request.options, request.parameters);
  
  var promise = new Promise(function(resolve, reject){
    var req = http.request(options, function(res){
     
      var body = '';
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
         if (res.statusCode >= 400)
            return reject({status: res.statusCode, body: body });
        
         return resolve({raw: res, body: body });
      });
     
    });
    
    req.on('error', function(e){
      return reject({status: 0, message: e });
    });
    
    if (options.method !== 'GET' && request.parameters){
      req.write(request.parameters);
    }
    
    req.end();
    
  });
  return promise;
};

FeignNodeClient.prototype._createHttpOptions = function(baseUrl, requestOptions, parameters){
  var options  = Args([
      { method: Args.STRING | Args.Optional, _default: 'GET' },
      { uri: Args.STRING | Args.Required}
    ], [requestOptions]);

  var url = URL.parse(baseUrl + options.uri, true);
  if (options.method === 'GET'){
    url.query = _.defaults(parameters, url.query);  
  }
  url =  URL.parse(URL.format(url));
  return _.defaults({
    hostname: url.hostname,
    port: url.port,
    method: options.method,
    path: url.path
  }, this.defaults);
};


module.exports = FeignNodeClient;
