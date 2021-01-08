const Grocery = require('../models/grocery');
const Category = require('../models/category');
const Location = require('../models/location');

const { body, validationResult } = require('express-validator');
const async = require('async');

exports.index = (req, res) => {
  res.render('index', { title: 'Grocery Inventory' });
};

// Create a grocery
exports.grocery_create_get = (req, res, next) => {
  async.parallel({
    categories: function(callback) { Category.find(callback) },
    locations: function(callback) { Location.find(callback) },
  }, function(err, results) {
    if (err) { return next(err); }
    res.render('grocery_form', { title: 'Create a new Grocery', categories: results.categories, locations: results.locations });
  });
};

exports.grocery_create_post = [
  // Validate and sanitize fields
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('price', 'Price must not be empty.').escape(),
  body('inventory', 'Inventory must not be empty.').escape(),
  body('category', 'Category must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('location', 'Location must not be empty.').trim().isLength({ min: 1 }).escape(),
  // plu is optional

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a new Grocery object with escaped and trimmed data.
    let grocery = new Grocery(
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        inventory: req.body.inventory,
        category: req.body.category,
        location: req.body.location,
        plu: req.body.plu 
      }
    );
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      async.parallel({
        categories: function(callback) { Category.find(callback) },
        locations: function(callback) { Location.find(callback) },
      }, function(err, results) {
        if (err) { return next(err); }

        res.render('grocery_form', { title: 'Create a new Grocery', categories: results.categories, locations: results.locations, errors: errors.array() });
      });
      return;
    } else {
      // Data from form is valid.  Save grocery
      grocery.save(function(err) {
        if (err) { return next(err); }
        // successful - redirect to new grocery
        res.redirect(grocery.url);
      });
    }
  }
];

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