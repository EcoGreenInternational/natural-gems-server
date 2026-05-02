const mongoose = require('mongoose');

const gemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    required: true,
     enum: ['Classical', 'Retail', 'Precious', 'Semi-Precious', 'Rare', 'Collector', 'Birthstone']
},
  gemType: { type: String }, // e.g. Ruby, Sapphire, Emerald
  price: { type: Number, required: true },
  status: { type: String, enum: ['Available', 'Sold'], default: 'Available' },
  description: { type: String },
  image: { type: String },
  images: [{ type: String }],
  // Gem detail fields
  weight: { type: String },
  clarity: { type: String },
  size: { type: String },
  colour: { type: String },
  shapeAndCut: { type: String },
  treatment: { type: String },
  certificate: { type: String },
  origin: { type: String, default: 'Sri Lanka' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gem', gemSchema);
