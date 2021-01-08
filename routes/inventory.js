const express = require('express');
const router = express.Router();

const location_controller = require('../controllers/locationController');
const category_controller = require('../controllers/categoryController');
const grocery_controller = require('../controllers/groceryController');

// Main Index Route //
router.get('/', grocery_controller.index);

// Location Routes //
// GET request for creating a location
router.get('/location/create', location_controller.location_create_get);

// POST request for creating a location
router.post('/location/create', location_controller.location_create_post);

// GET request for list of all locations
router.get('/locations', location_controller.location_list);

// GET request for individual location 
router.get('/location/:id', location_controller.location_detail);

// GET request for updating a location
router.get('/location/:id/update', location_controller.location_update_get);

// POST request for updating a location
router.post('/location/:id/update', location_controller.location_update_post);

// GET request for deleting a location
router.get('/location/:id/delete', location_controller.location_delete_get);

// POST request for deleting a location
router.post('/location/:id/delete', location_controller.location_delete_post);

// Category Routes //
// GET request for creating a category
router.get('/category/create', category_controller.category_create_get);

// POST request for creating a category
router.post('/category/create', category_controller.category_create_post);

// GET request for list of all categories
router.get('/categories', category_controller.category_list);

// GET request for individual category
router.get('/category/:id', category_controller.category_detail);

// GET request for updating a category
router.get('/category/:id/update', category_controller.category_update_get);

// POST request for updating a category
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for deleting a category
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request for deleting a category
router.post('/category/:id/delete', category_controller.category_delete_post);

// Grocery Routes //
// GET request for creating a grocery
router.get('/grocery/create', grocery_controller.grocery_create_get);

// POST request for creating a grocery
router.post('/grocery/create', grocery_controller.grocery_create_post);

// GET request for list of all groceries
router.get('/groceries', grocery_controller.grocery_list);

// GET request for individual grocery
router.get('/grocery/:id', grocery_controller.grocery_detail);

// GET request for updating a grocery
router.get('/grocery/:id/update', grocery_controller.grocery_update_get);

// POST request for updating a grocery
router.post('/grocery/:id/update', grocery_controller.grocery_update_post);

// GET request for deleting a grocery
router.get('/grocery/:id/delete', grocery_controller.grocery_delete_get);

// POST request for deleting a grocery
router.post('/grocery/:id/delete', grocery_controller.grocery_delete_post);

module.exports = router;
