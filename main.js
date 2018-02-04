var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var filename;
  console.log("."+q.pathname);

  var deny = ["/main.js","/package.json","/package-lock.json","node_modules"];
  var denyfolders = ["node_modules"];
  var detectdeny = false;

  console.log(q.pathname.split("/")[0]);

  detectdeny = deny[q.pathname] || deny[q.pathname.split("/")[1]]

  if (q.pathname!="/")
    filename = "."+q.pathname;
  else
    filename = "./index.html";

  fs.readFile(filename, function(err, data) {
    if (err || detectdeny) {
      if (detectdeny){
        console.log("connection denied");
        res.writeHead(403, {'Content-Type': 'text/html'});
        return res.end("403 Forbidden");
      } else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found :(");
      }
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}).listen(port);
