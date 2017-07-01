'use strict';

module.exports = function (server) {
  // Install a `/` route that returns server status
  // server.use(function (req, res, next) {
  //   console.log('hello world from "catch-all" route');
  //   console.log(req.headers.authorization);
  //   next();
  // });

  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  server.use(router);

};
