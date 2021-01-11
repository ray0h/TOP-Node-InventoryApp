const Grocery = require('../models/grocery');
const Category = require('../models/category');
const Location = require('../models/location');
const Image = require('../models/image');

const path = require('path');
const fs = require('fs');
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
  // plu, imagelink are optional

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
        plu: req.body.plu,
        imagelink: req.body.imagelink
      }
    );
    let image = false;
    if (req.file) {
      console.log('FILE', req.file);
      image = new Image(
        {
          data: fs.readFileSync(path.join(__dirname, '../', '/public/images/' + req.file.filename)),
          contentType: req.file.mimetype,
          grocery: grocery.id
        }
      );
      fs.unlink('public/images/' + req.file.filename, (err) => {
        if (err) return next(err);
        console.log(req.file.filename + ' deleted');
      });
    } 
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
      if (image) {
        image.save(function(err) { if (err) { return next(err); } });
      }
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
  async.parallel({
    grocery: function(callback) { Grocery.findById(req.params.id).populate('category').populate('location').exec(callback) },
    grocery_image: function(callback) { Image.find({ 'grocery': req.params.id }).exec(callback) },
  }, function (err, results) {
    if (err) { return next(err); }
    res.render('grocery_detail', { title: 'Grocery Detail', grocery: results.grocery, grocery_image: results.grocery_image });
  })
};

// Update a grocery
exports.grocery_update_get = (req, res, next) => {
  async.parallel({
    grocery: function(callback) { Grocery.findById(req.params.id).populate('category').populate('location').exec(callback) },
    categories: function(callback) { Category.find(callback) },
    locations: function(callback) { Location.find(callback) },
    grocery_image: function(callback) { Image.find({ 'grocery': req.params.id }).exec(callback) },
  }, function(err, results) {
    if (err) { return next(err); }
    res.render('grocery_form', { title: 'Update Grocery', grocery: results.grocery, categories: results.categories, locations: results.locations, grocery_image: results.grocery_image });
  });
};

exports.grocery_update_post = [
  // Validate and sanitize fields
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('price', 'Price must not be empty.').escape(),
  body('inventory', 'Inventory must not be empty.').escape(),
  body('category', 'Category must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('location', 'Location must not be empty.').trim().isLength({ min: 1 }).escape(),
  // imagelink, plu are optional

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
        plu: req.body.plu,
        imagelink: req.body.imagelink,
        _id: req.params.id
      }
    );

    let image = false;
    if (req.file) {
      console.log('FILE', req.file);
      async.series({
        img: function (cb) { Image.find({ 'grocery': req.params.id }).exec(cb) }
      }, function(err, results) {
        if (err) { return next(err); }
        console.log('already', results.img)
        if ( results.img.length == 0) {
          // create a new image
          image = new Image({
            data: fs.readFileSync(path.join(__dirname, '../', '/public/images/' + req.file.filename)),
            contentType: req.file.mimetype,
            grocery: grocery.id,
          });
          image.save(function(err) { if (err) return next(err); })
        } else {
          // update image
          image = new Image({
            data: fs.readFileSync(path.join(__dirname, '../', '/public/images/' + req.file.filename)),
            contentType: req.file.mimetype,
            grocery: grocery.id,
            _id: results.img[0].id
          });
          Image.findByIdAndUpdate(results.img[0].id, image, {}, function (err) {
            if (err) { return next(err); }
            console.log('updated image')
          }); 
        }
      });
      fs.unlink('/public/images/' + req.file.filename, (err) => {
        if (err) return next(err);
        console.log(req.file.filename + ' deleted');
      });
    } 

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      async.parallel({
        grocery: function(callback) { Grocery.findById(req.params.id).populate('category').populate('location').exec(callback) },
        categories: function(callback) { Category.find(callback) },
        locations: function(callback) { Location.find(callback) },
      }, function(err, results) {
        if (err) { return next(err); }

        res.render('grocery_form', { title: 'Update Grocery', grocery: results.grocery, categories: results.categories, locations: results.locations, errors: errors.array() });
      });
      return;
    } else {
      // Data from form is valid.  Update grocery
      Grocery.findByIdAndUpdate(req.params.id, grocery, {}, function(err, thisgrocery) {
        if (err) { return next(err); }
        // successful - redirect to new grocery 
        res.redirect(thisgrocery.url);
        // res.render('grocery_detail', { title: 'Grocery Detail', grocery: thisgrocery, grocery_image: img });
      });
    }
  }
];

// Delete a grocery
exports.grocery_delete_get = (req, res, next) => {
  async.parallel({
    grocery_image: function(callback) { Image.find({ 'grocery': req.params.id }).exec(callback) },
    grocery: function(callback) {
      Grocery.findById(req.params.id).populate('category').populate('location').exec(callback) 
    }
  }, function(err, results) {
    if (err) { return next(err); }
    res.render('grocery_delete', {title: 'Delete Grocery', grocery: results.grocery, grocery_image: results.grocery_image });
  });
};

exports.grocery_delete_post = (req, res, next) => {
  // Logic for ensuring occupied groceries handled via Conditional View
  // Delete any attached images from db
  Image.find({'grocery': req.params.id}, function(err, grocery_image) {
    if (err) return next(err);
    console.log('grocery image', grocery_image[0].id)
    if (grocery_image) {
      Image.findByIdAndDelete(grocery_image[0].id).exec(function(err) {
        if (err) return next(err);
      })
    }
  }).exec();
  Grocery.findByIdAndDelete(req.params.id, function deletegrocery(err) {
    if (err) { return next(err); }
    res.redirect('/inventory/groceries')
  });
};