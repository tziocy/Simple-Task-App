const router = require('express-promise-router')();
const User = require('../models/User');
const _ = require('lodash');

router.get('/me', async (req, res) => {
  const user = await User.findById(req.user._id);
  return res.status(200).json(user);
});

router.put('/', async (req, res) => {
  try {
    const body = _.pick(req.body, ['_id', 'firstName', 'lastName', 'email', 'phone', 'language', 'password']);
    const user = await User.findById(body._id || req.user._id);
    if (!user) return res.status(400).json({ errors: [{ msg: 'userDoesNotExist' }] });
    if (_.isEmpty(body.password)) {
      delete body.password;
    }
    if (_.isEmpty(body.email)) {
      body.email = undefined;
    }
    user.set(body);
    await user.save();
    return res.status(200).json(user);
  } catch (err) {
    if ((err.name === 'MongoError') && (err.code === 11000)) {
      const fields = Object.keys(err.keyPattern);
      return res.status(400).json({ errors: fields.map(field => ({ msg: `duplicate.${field}` })) });
    }
    else throw err;
  }
});

router.post('/', async (req, res) => {
  try {
    const data = await User.create(req.body);
    return res.status(200).json(data);
  } catch (err) {
    if ((err.name === 'MongoError') && (err.code === 11000)) {
      const fields = Object.keys(err.keyPattern);
      return res.status(400).json({ errors: fields.map(field => ({ msg: `duplicate.${field}` })) });
    }
    else throw err;
  }
});

router.delete('/:id', async (req, res) => {
  await User.findByIdAndRemove(req.params.id);
  return res.status(200).json();
});

router.post('/search', async (req, res) => {
  const { page, size, filters } = req.body;

  const pageAsNumber = Number(page);
  const sizeAsNumber = Number(size);
  const finalPage = (!_.isNil(page) && _.isInteger(pageAsNumber) && pageAsNumber > 0) ? pageAsNumber - 1 : 0;
  const finalSize = (!_.isNil(size) && _.isInteger(sizeAsNumber) && sizeAsNumber > 0) ? Math.min(sizeAsNumber, 100) : 10;

  const finalFilters = _(filters).pick(['username', 'firstName', 'lastName', 'email', 'phone']).mapValues(v => new RegExp(v, 'gi')).value();

  const users = await User.aggregate([
    { $sort: { _id: -1 }},
    { $match: { username: { $ne: 'admin' } } },
    { $match: { ...finalFilters } },
    { $project: { password: 0 } },
    { $facet: {
        data: [
          { $skip: finalPage * finalSize },
          { $limit: finalSize }
        ],
        total: [
          { $count: "total" }
        ]
      }
    },
    {
      $project: {
        data: 1,
        total: { $arrayElemAt: ["$total.total", 0] }
      }
    }
  ]);

  return res.status(200).json(_.defaults(users[0], { data: [], total: 0, pageSize: finalSize, current: finalPage + 1, filters }));
});

module.exports = router;
