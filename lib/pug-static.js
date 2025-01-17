/*
  "name": "pug-static",
  "version": "1.0.1",
  "description": "Serve static Pug files from an Express server.",
  "homepage": "http://github.com/ryan-schroeder/pug-static.git",
  "author": {
    "name": "Salehen Shovon Rahman",
    "email": "sal@linux.com",
    "url": "http://shovon.github.com/"
  }
*/
var checkFileAndProcess, fs, path, pug, readAndSendTemplate;

path = require('path');

fs = require('fs');

pug = require('pug');

readAndSendTemplate = function(d, res, next) {
  return fs.readFile(d, 'utf8', function(err, data) {
    var error, html, template;
    if (err != null) {
      return next();
    }
    try {
      template = pug.compile(data, {
        filename: d
      });
      html = template({
        __: function (sentence) {
          return sentence;
        },
      });
      return res.send(html, {
        'Content-Type': 'text/html'
      }, 200);
    } catch (error) {
      err = error;
      return next(err);
    }
  });
};

checkFileAndProcess = function(d, res, next) {
  return fs.lstat(d, function(err, stats) {
    if ((err == null) && stats.isFile()) {
      return readAndSendTemplate(d, res, next);
    } else {
      return next();
    }
  });
};

module.exports = function(options) {
  if (options == null) {
    throw new Error("A path must be specified.");
  }
  if (typeof options === 'string') {
    options = {
      src: options,
      html: true
    };
  }
  if (typeof options.html === 'undefined') {
    options.html = true;
  }
  return function(req, res, next) {
    var d;
    d = path.join(options.src, req.url);
    return fs.lstat(d, function(err, stats) {
      if ((err == null) && stats.isDirectory()) {
        return checkFileAndProcess(d + "/index.pug", res, next);
      } else if ((err == null) && stats.isFile() && path.extname(d) === '.pug') {
        return readAndSendTemplate(d, res, next);
      } else if ((options.html != null) && path.extname(d) === '.html') {
        return checkFileAndProcess(d.replace(/html$/, 'pug'), res, next);
      } else {
        return next();
      }
    });
  };
};
