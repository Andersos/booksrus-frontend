var express = require('express');
var jp = require('jsonpath');
var router = express.Router();
var goodGuy = require('good-guy-http')({maxRetries: 3});

var BOOK_SERVICE_URL = 'https://book-catalog-proxy-4.herokuapp.com/book?isbn=';

router.get('/:isbn', function(req, res, next) {
  req.esiOptions = {
    headers: {
      'Accept': 'text/html',
      'x-request-id': req.get('x-request-id')
    }
  };
  goodGuy({url: `${BOOK_SERVICE_URL}${req.params.isbn}`, json: true}).then((data) => {
    var pageData = {
      title: jp.value(data.body, '$..title'),
      subtitle: jp.value(data.body, '$..subtitle'),
      cover: jp.value(data.body, '$..thumbnail'),
      isbn: req.params.isbn,
      id: req.get('x-request-id')
    };
    res.render('book', pageData);
  })
});

module.exports = router;
