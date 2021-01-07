const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LocationSchema = new Schema(
  {
    name: { type: String, required: true },
  }
);

// Virtual for category's URL
LocationSchema.virtual('url').get(function() { return '/inventory/location/' + this._id });

module.exports = mongoose.model('Location', LocationSchema);
