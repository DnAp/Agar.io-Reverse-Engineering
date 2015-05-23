var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.argv[2] || 4940;

http.createServer(function(request, response) {
  console.log('GeneralRequest: ' + request.url);

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);

  var contentTypesByExtension = {
    '.html': "text/html",
    '.css':  "text/css",
    '.js':   "text/javascript"
  };

  fs.exists(filename, function(exists) {
    console.log('FileExist: ' + filename);
    if(request.url.indexOf("proxy.php")>=0){
      console.log('ProxyRequest: ' + request.url);
      if(request.url.indexOf("?info")<0){
        var post_data = request.toString();
        var post_options = {
          host: 'm.agar.io',
          port: '80',
          path: '/',
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': post_data.length
          }
        };

        // Set up the request
        var post_req = http.request(post_options, function(res) {
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
              console.log('PResponse: ' + chunk);
              response.writeHead(200, {"Content-Type": "text/plain"});
              response.write(chunk);
              response.end();
          });
        });

        // post the data
        post_req.write(post_data);
        post_req.end();
      }else{
        http.get("http://m.agar.io/info", function(res) {
                  // Buffer the body entirely for processing as a whole.
          var bodyChunks = [];
          res.on('data', function(chunk) {
            // You can process streamed parts here...
            bodyChunks.push(chunk);
          }).on('end', function() {
            var body = Buffer.concat(bodyChunks);
            console.log("GResponse: " + body);
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.write(body);
            response.end();
          })
        }).on('error', function(e) {
          console.log("GError: " + e.message);
        });
      }

      return;
    }

    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      var headers = {};
      var contentType = contentTypesByExtension[path.extname(filename)];
      if (contentType) headers["Content-Type"] = contentType;
      response.writeHead(200, headers);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");