#! /usr/bin/env node

console.log('This script populates some test groceries, categories, and locations to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

var async = require('async')
var Grocery = require('./models/grocery')
var Category = require('./models/category')
var Location = require('./models/location')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var groceries = []
var categories = []
var locations = []

function groceryCreate(name, description, price, inventory, category, location, plu, cb) {
  grocerydetail = {
    name: name,
    description: description,
    price: price,
    plu: plu ? plu : '',
    inventory: inventory,
    category: category,
    location: location
  }
  
  var grocery = new Grocery(grocerydetail);
       
  grocery.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Grocery: ' + grocery);
    groceries.push(grocery)
    cb(null, grocery)
  }  );
}

function categoryCreate(name, description, cb) {
  var category = new Category({ name: name, description: description });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}

function locationCreate(name, cb) {
  locationdetail = { 
    name: name
  }
    
  var location = new Location(locationdetail);    
  location.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Location: ' + location);
    locations.push(location)
    cb(null, location)
  }  );
}

function createLocations(cb) {
  async.series([
    function(callback) {
      locationCreate('Aisle1', callback);
    },
    function(callback) {
      locationCreate('Aisle2', callback);
    },
    function(callback) {
      locationCreate('Aisle3', callback);
    },
    function(callback) {
      locationCreate('Aisle4', callback);
    },
    function(callback) {
      locationCreate('Aisle5', callback);
    },
    function(callback) {
      locationCreate('Aisle6', callback);
    },
    function(callback) {
      locationCreate('Aisle7', callback);
    },
    function(callback) {
      locationCreate('Aisle8', callback);
    },
    function(callback) {
      locationCreate('Aisle9', callback);
    },
    function(callback) {
      locationCreate('Aisle10', callback);
    },
    function(callback) {
      locationCreate('Produce', callback);
    },
    function(callback) {
      locationCreate('Dairy', callback);
    },
    function(callback) {
      locationCreate('Meats', callback);
    },
    function(callback) {
      locationCreate('Seafood', callback);
    },
    function(callback) {
      locationCreate('Bakery', callback);
    },
    function(callback) {
      locationCreate('Pharmacy', callback);
    },
    ],
    // optional callback
    cb);
}

function createCategories(cb) {
  async.series([
    function(callback) {
      categoryCreate('Dairy', 'Milks, Cheeses, Butters, Eggs and other Dairy Related Products', callback);
    },
    function(callback) {
      categoryCreate('Meats', 'Beef, Pork, Chicken, and rotating assortment of additional fresh meats', callback);
    },
    function(callback) {
      categoryCreate('Seafood', 'Regional Fish, Shellfish, and rotating assortment of additional fresh and frozen seafoods', callback);
    },
    function(callback) {
      categoryCreate('Produce', 'Fresh vegetables, fruits, legumes sourced from local farms', callback);
    },
    function(callback) {
      categoryCreate('Baked Goods', 'Misc, fresh baked goods made in house at our bakery', callback);
    },
    function(callback) {
      categoryCreate('Breads', 'Prepackaged buns, rolls, breads', callback);
    },
    function(callback) {
      categoryCreate('Canned Goods', 'Canned vegetables, fruits, meats, sauces, etc.', callback);
    },
    function(callback) {
      categoryCreate('Dried Goods', 'Dried pastas, rices, beans and other misc pantry related goods', callback);
    },
    function(callback) {
      categoryCreate('Condiments', 'Ketchups, mustards, mayonaises and other assortment of sauces, garnishes, etc.', callback);
    },
    function(callback) {
      categoryCreate('Frozen Goods', 'Frozen vegetables, fruits, breads, juices, pizzas, snack foods, etc.', callback);
    },
    function(callback) {
      categoryCreate('Frozen Desserts', 'Ice creams, frozen yogurts, sorbets, gelatos, and other favorite frozen sweets', callback);
    },
    function(callback) {
      categoryCreate('Cookies/Crackers', 'Prepackaged cookies and crackers', callback);
    },
    function(callback) {
      categoryCreate('Snack Foods', 'Chips, Crisps, Pretzels, Popcorns, and other misc. snack foods', callback);
    },
    function(callback) {
      categoryCreate('International', 'Assortment of South American, African, European, Asian related foodstuffs', callback);
    },
    function(callback) {
      categoryCreate('Breakfast Foods', 'Cereals, Granolas, Oats, Grits, Bars, and other favorite breakfast related foods.', callback);
    },
    function(callback) {
      categoryCreate('Baking/Spices', 'Flours, Sugars, Salts, Spices and other baking related items', callback);
    },
    function(callback) {
      categoryCreate('Water/Beverages', 'Bottled waters, sodas, teas, coffees', callback);
    },
    function(callback) {
      categoryCreate('Beer/Wine', 'Domestic/Imported beers and wines, mixers and misc cocktail related paraphenalia', callback);
    },
    function(callback) {
      categoryCreate('Home Goods', 'Light bulbs, filters, and other home related hardware goods', callback);
    },
    function(callback) {
      categoryCreate('Personal Hygiene', 'Soaps, Shampoos, Toothpastes, Lotions, Diapers, Feminine Products and other hygiene related items', callback);
    },
    function(callback) {
      categoryCreate('Medicine', 'OTC pain medication, allergy, bandages, antiseptics, compresses, and other misc medical items', callback);
    },
    function(callback) {
      categoryCreate('Pet Needs', 'Dog/Cat foods, pet toys, other misc pet products', callback);
    },
  ],
  // optional callback
  cb);
}

function createGroceries(cb) {
  async.parallel([
    function(callback) {
      groceryCreate('Bacon', '1lb, cured and smoked pork belly', 6.0, 9, categories[1], locations[12], '',callback);
    },
    function(callback) {
      groceryCreate('LR Coffee', '1lb, Whole Bean, light roast', 8.99, 16, categories[16], locations[6], '',callback);
    },
    function(callback) {
      groceryCreate('Broccoli', '1lb brocoli', 2.99, 20, categories[3], locations[10], '4060', callback);
    },
    function(callback) {
      groceryCreate('Bananas', '1lb bananas', 0.99, 25, categories[3], locations[10], '4011', callback);
    },
    function(callback) {
      groceryCreate('Romaine Lettuce', 'Head of Romaine Lettuce', 2.99, 23, categories[3], locations[10], '4640', callback);
    },
    function(callback) {
      groceryCreate('Granny Smith Apples', '1lb granny smith apples', 1.99, 14, categories[3], locations[10], '4017', callback);
    },
    function(callback) {
      groceryCreate('Aspirin', '100 ct aspirin', 5.49, 13, categories[20], locations[8], '', callback);
    }, 
    function(callback) {
      groceryCreate('Yuengling Beer', '6 pack bottles Yuengling Beer', 5.99, 8, categories[17], locations[6], '', callback);
    },
    function(callback) {
      groceryCreate('AP Flour', '5lb all purpose flour', 1.89, 21, categories[15], locations[4], '', callback);
    },
    function(callback) {
      groceryCreate('Instant Yeast', '3 pack, instant yeast', 1.99, 8, categories[15], locations[4], '', callback);
    },
    function(callback) {
      groceryCreate('Spam', 'Can Hormel Spam', 3.99, 2, categories[6], locations[1], '', callback);
    },
    function(callback) {
      groceryCreate('Mayonaise', 'Bottle of mayo', 2.99, 5, categories[8], locations[1], '', callback);
    },
    function(callback) {
      groceryCreate('2% Milk', '1gal, 2% milk', 2.99, 12, categories[0], locations[11], '', callback);
    },
    function(callback) {
      groceryCreate('Salmon Filet', '1lb Atlantic Salmon filets', 7.99, 26, categories[2], locations[13], '', callback);
    },
    function(callback) {
      groceryCreate('Strawberry Ice Cream', '1gal Strawberry Ice Cream', 3.99, 16, categories[10], locations[9], '', callback);
    },
    function(callback) {
      groceryCreate('Steel Cut Oats', '1lb whole steel cut oats', 2.49, 28, categories[14], locations[4], '', callback);
    },
    function(callback) {
      groceryCreate('White Bread', '1loaf sliced white bread', 1.99, 19, categories[5], locations[0], '', callback);
    },
    function(callback) {
      groceryCreate('Cola', '12pack Generic Cola', 5.99, 12, categories[16], locations[6], '', callback);
    },
  ],
  // optional callback
  cb);
}

async.series([
  createLocations,
  createCategories,
  createGroceries
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



