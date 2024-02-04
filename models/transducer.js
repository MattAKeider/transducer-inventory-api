const mongoose = require('mongoose');

const locations = ['CMC', 'MIDTOWN', 'RISMAN', 'CROCKER', 'STREETSBORO', 'BETTY THE BUS'];
const departments = ['MFM', 'L&D', 'IVF'];
const types = ['TV', 'TA'];

const Schema = mongoose.Schema;

const transducerSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true, enum: locations },
  department: { type: String, required: true, enum: departments },
  transducerType: { type: String, required: true, enum: types },
  room: { type: String, required: true },
  serialNumber: { type: String, required: true },
  internalIdentifier: { type: String, required: true },
  controlNumber: { type: String, required: true },
  dateReceived: { type: Date, required: true },
  outOfService: { type: Boolean },
  currentCondition: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Condition' }]
});

module.exports = mongoose.model('Transducer', transducerSchema);
