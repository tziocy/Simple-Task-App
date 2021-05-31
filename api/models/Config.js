const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConfigSchema = new Schema({
  logo: String,
});

module.exports = mongoose.model('Config', ConfigSchema);
