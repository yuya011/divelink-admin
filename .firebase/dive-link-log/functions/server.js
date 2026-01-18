const { onRequest } = require('firebase-functions/v2/https');
  const server = import('firebase-frameworks');
  exports.ssrdivelinklog = onRequest({"region":"asia-northeast1"}, (req, res) => server.then(it => it.handle(req, res)));
  