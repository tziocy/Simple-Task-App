const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const verifyAsync = promisify(jwt.verify);

const authenticate = (req, res, next) => {
  const authorizationHeader = req.header('authorization');
  const token = !_.isEmpty(authorizationHeader) && _.isString(authorizationHeader) && authorizationHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: 'Requires user authentication' });
  verifyAsync(token, process.env.JWT_SECRET, { algorithms: ['HS512'], issuer: process.env.JWT_ISSUER })
    .then((data) => {
      req.user = { _id: data.sub._id, username: data.sub.username };
      next();
    })
    .catch(() => res.status(401).json({ error: true, message: 'Unauthorized' }));
};

module.exports = authenticate;
