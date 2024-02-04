const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const conditions = ['New', 'Working', 'Refurbished', 'Loaner', 'Broken (Out of Service)'];

const conditionSchema = new Schema({
  condition: { type: String, required: true, enum: conditions },
  conditionChangedDate: { type: Date, required: true, default: new Date() },
  note: { type: String },
  transducer: { type: mongoose.Types.ObjectId, required: true, ref: 'Transducer' }
});

module.exports = mongoose.model('Condition', conditionSchema);