'use strict';

var _ = require('lodash');
var Detail = require('./detail.model');

// Get list of details
exports.index = function(req, res) {
  Detail.find(function (err, details) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(details);
  });
};

// Get a single detail
exports.show = function(req, res) {
  Detail.findById(req.params.id, function (err, detail) {
    if(err) { return handleError(res, err); }
    if(!detail) { return res.status(404).send('Not Found'); }
    return res.json(detail);
  });
};

// Creates a new detail in the DB.
exports.create = function(req, res) {
  Detail.create(req.body, function(err, detail) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(detail);
  });
};

// Updates an existing detail in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Detail.findById(req.params.id, function (err, detail) {
    if (err) { return handleError(res, err); }
    if(!detail) { return res.status(404).send('Not Found'); }
    var updated = _.extend(detail, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(detail);
    });
  });
};

// Deletes a detail from the DB.
exports.destroy = function(req, res) {
  Detail.findById(req.params.id, function (err, detail) {
    if(err) { return handleError(res, err); }
    if(!detail) { return res.status(404).send('Not Found'); }
    detail.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}