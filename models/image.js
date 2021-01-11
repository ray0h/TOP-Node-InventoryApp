const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ImageSchema = new Schema(
  {
    data: Buffer,
    contentType: String,
    grocery: { type: Schema.Types.ObjectId, ref: 'Grocery', required: true }
  }
);

module.exports = mongoose.model('Image', ImageSchema);