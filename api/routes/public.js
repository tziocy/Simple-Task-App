const router = require('express-promise-router')();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const signAsync = promisify(jwt.sign);

const Config = require('../models/Config');
const User = require('../models/User');

const generateToken = (sub) => {
  const creationDate = Date.now();
  const expirationDate = creationDate + process.env.JWT_EXPIRATION_MS;
  const iat = Math.floor(creationDate / 1000);
  const exp = Math.floor(expirationDate / 1000);
  const iss = process.env.JWT_ISSUER;
  return signAsync({
    iat,
    exp,
    iss,
    sub,
  }, process.env.JWT_SECRET, { algorithm: 'HS512' });
};

router.get('/config', async (req, res) => {
  const config = await Config.findOne({}, 'logo companyName taxValue address taxID phone emailAddress');
  return res.status(200).json(config || {});
});

//  User Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (_.isEmpty(username) || _.isEmpty(password)) return res.status(400).json({ error: true, message: 'Incorrect username and/or password' });
  const user = await User.findOne({ username }, '+password').lean();
  if (!user) return res.status(400).json({ error: true, message: 'Incorrect username and/or password' });
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) return res.status(400).json({ error: true, message: 'Incorrect username and/or password' });
  const sanitisedUser = _.omit(user, 'password');
  const token = await generateToken(_.pick(user, ['_id', 'username']));
  return res.status(200).json({ user: sanitisedUser, token });
});

module.exports = router;
