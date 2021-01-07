const Category = require('../models/category');
const Grocery = require('../models/grocery');

const { body, validationResult } = require('express-validator');
const async = require('async');

// Create a category
exports.category_create_get = (req, res, next) => {
  res.send('Not implemented yet, category_create_get');
};

exports.category_create_post = (req, res) => {
  res.send('Not implemented yet, category_create_post');
};

// Display list of all categories
exports.category_list = (req, res) => { 
  Category.find()
    .sort([['name', 'ascending']])
    .exec((err, list_categories) => {
      if (err) { return next(err); };
      // Successful, so render.
      res.render('category_list', { title: 'Category List', category_list: list_categories });
    });
};

// Display single category
exports.category_detail = (req, res, next) => {
  async.parallel({
    category: function(callback) {
      Category.findById(req.params.id).exec(callback) 
    },
    grocery_list: function(callback) {
      Grocery.find({ 'category': req.params.id }).exec(callback)
    },
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.category==null) {
        var err = new Error('Category not found');
        err.status = 404;
        return next(err);
      }
      res.render('category_detail', { title: 'Category Detail', category: results.category, grocery_list: results.grocery_list })
  });
};

// Update a category
exports.category_update_get = (req, res) => {
  res.send('Not implemented yet, category_update_get');
};

exports.category_update_post = (req, res) => {
  res.send('Not implemented yet, category_update_post');
};

// Delete a category
exports.category_delete_get = (req, res) => {
  res.send('Not implemented yet, category_delete_get');
};

exports.category_delete_post = (req, res) => {
  res.send('Not implemented yet, category_delete_post');
};