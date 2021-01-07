const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GrocerySchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true },
    price: { type: mongoose.Decimal128, required: true },
    inventory: { type: Number, default: 0 },
    plu: String,
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    location: { type: Schema.Types.ObjectId, ref: 'Location', required: true }
  }
);

// Virtual for grocery's URL
GrocerySchema.virtual('url').get(function() { return '/inventory/grocery/' + this._id });

module.exports = mongoose.model('Grocery', GrocerySchema);
