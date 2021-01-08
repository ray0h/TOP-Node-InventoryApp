const Category = require('../models/category');
const Grocery = require('../models/grocery');

const { body, validationResult } = require('express-validator');
const async = require('async');

// Create a category
exports.category_create_get = (req, res) => {
  res.render('category_form', { title: 'Create a New Category'});
};

exports.category_create_post = [
  // Validate and sanitize category fields (nake, description)
  body('name', 'Category name required').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation/sanitization
  (req, res, next) => {
    // Extract validation errors from request
    const errors = validationResult(req);

    let category = new Category(
      {
        name: req.body.name,
        description: req.body.description
      }
    );
    if (!errors.isEmpty()) {
      // Rerender form due to errors.
      res.render('category_form', { title: 'Create a New Category' });
      return;
    } else {
      // Form data is valid.  Save new category.
      category.save(function(err) {
        if (err) { return next(err); }
        // else successful - redirect to new category
        res.redirect(category.url);
      });
    }
  }
];

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
exports.category_update_get = (req, res, next) => {
  Category.findById(req.params.id).exec(function(err, category) {
    if (err) { return next(err); }
    res.render('category_form', { title: 'Update Category', category: category });
  });
};

exports.category_update_post = [
  // Validate and sanitize category fields (nake, description)
  body('name', 'Category name required').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation/sanitization
  (req, res, next) => {
    // Extract validation errors from request
    const errors = validationResult(req);

    let category = new Category(
      {
        name: req.body.name,
        description: req.body.description,
        _id: req.params.id
      }
    );
    if (!errors.isEmpty()) {
      // Rerender form due to errors.
      res.render('category_form', { title: 'Create a New Category' });
      return;
    } else {
      // Form data is valid.  Update new category.
      Category.findByIdAndUpdate(req.params.id, category, {}, function (err, thiscategory) {
        if (err) { return next(err); }
        // else successful - redirect to new category
        res.redirect(thiscategory.url);
      });
    }
  }
];

// Delete a category
exports.category_delete_get = (req, res, next) => {
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
      res.render('category_delete', { title: 'Delete', category: results.category, category_groceries: results.grocery_list })
  });
};

exports.category_delete_post = (req, res, next) => {
   // Logic for ensuring occupied categories handled via Conditional View
   Category.findByIdAndDelete(req.params.id, function deletecategory(err) {
    if (err) { return next(err); }
    res.redirect('/inventory/categories')
  });
};