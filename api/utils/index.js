const User = require('../models/User');

const initialiseAdmin = async () => {
  const admin = await User.findOne({ username: 'admin' });
  if (admin) return;
  await User({ username: 'admin', password: process.env.ADMIN_PASSWORD }).save();
  console.log('Created admin account.');
};

module.exports = {
  initialiseAdmin
};

