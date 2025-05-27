const mongoose = require('mongoose')

const PropertySchema = new mongoose.Schema({
  propertyId: { type: String, unique: true },
  title: String,
  type: String,
  price: Number,
  state: String,
  city: String,
  areaSqFt: Number,
  bedrooms: Number,
  bathrooms: Number,
  amenities: [String],
  furnished: String,
  availableFrom: Date,
  listedBy: String,
  tags: [String],
  colorTheme: String,
  rating: Number,
  isVerified: Boolean,
  listingType: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);