const Category = require('../models/category');

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
exports.category_detail = (req, res) => {
  res.send('Not implemented yet, category_detail');
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