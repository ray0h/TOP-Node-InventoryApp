const Grocery = require('../models/grocery');

const { body, validationResult } = require('express-validator');
const async = require('async');

exports.index = (req, res) => {
  res.render('index', { title: 'Grocery Inventory' });
};

// Create a grocery
exports.grocery_create_get = (req, res) => {
  res.send('Not implemented yet, grocery_create_get');
};

exports.grocery_create_post = (req, res) => {
  res.send('Not implemented yet, grocery_create_post');
};

// Display list of all groceries
exports.grocery_list = (req, res) => { 
  Grocery.find()
    .sort([['name', 'ascending']])
    .exec((err, list_groceries) => {
      if (err) { return next(err); };
      // Successful, so render.
      res.render('grocery_list', { title: 'Grocery List', grocery_list: list_groceries });
    });
};

// Display single grocery
exports.grocery_detail = (req, res) => {
  Grocery.findById(req.params.id).populate('category').populate('location').exec(function(err, grocery) {
    if (err) { return next(err); }
    if (grocery==null) {
      var err = new Error('Grocery not found');
      err.status = 404;
      return next(err);
    }
    res.render('grocery_detail', { title: 'Grocery Detail', grocery: grocery });
  });
};

// Update a grocery
exports.grocery_update_get = (req, res) => {
  res.send('Not implemented yet, grocery_update_get');
};

exports.grocery_update_post = (req, res) => {
  res.send('Not implemented yet, grocery_update_post');
};

// Delete a grocery
exports.grocery_delete_get = (req, res) => {
  res.send('Not implemented yet, grocery_delete_get');
};

exports.grocery_delete_post = (req, res) => {
  res.send('Not implemented yet, grocery_delete_post');
};