const Location = require('../models/location');
const Grocery = require('../models/grocery');

const { body, validationResult } = require('express-validator');
const async = require('async');

// Create a location
exports.location_create_get = (req, res) => {
  res.send('Not implemented yet, location_create_get');
};

exports.location_create_post = (req, res) => {
  res.send('Not implemented yet, location_create_post');
};

// Display list of all locations
exports.location_list = (req, res) => { 
  Location.find()
    .sort([['name', 'ascending']])  
    .exec((err, list_locations) => {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('location_list', { title: 'Location List', location_list: list_locations })
    });
};

// Display single location
exports.location_detail = (req, res, next) => {
  async.parallel({
    location: function(callback) {
      Location.findById(req.params.id).exec(callback) 
    },
    grocery_list: function(callback) {
      Grocery.find({ 'location': req.params.id }).exec(callback)
    },
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.location==null) {
        var err = new Error('Location not found');
        err.status = 404;
        return next(err);
      }
      res.render('location_detail', { title: 'Location Detail', location: results.location, grocery_list: results.grocery_list })
  });
};

// Update a location
exports.location_update_get = (req, res) => {
  res.send('Not implemented yet, location_update_get');
};

exports.location_update_post = (req, res) => {
  res.send('Not implemented yet, location_update_post');
};

// Delete a location
exports.location_delete_get = (req, res) => {
  res.send('Not implemented yet, location_delete_get');
};

exports.location_delete_post = (req, res) => {
  res.send('Not implemented yet, location_delete_post');
};