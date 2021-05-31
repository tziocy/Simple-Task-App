const router = require('express-promise-router')();
const Config = require('../models/Config');

router.get('/', async (req, res) => {
  const config = await Config.findOne({});
  return res.status(200).json(config || {});
});

router.put('/', async (req, res) => {
  const config = await Config.findOneAndUpdate({}, req.body, { new: true }).lean();
  return res.status(200).json(config);
});

module.exports = router;
