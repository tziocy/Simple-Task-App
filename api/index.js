const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const mongoose = require('mongoose');
const utils = require("./utils");

const main = async () => {

  const app = express();

  app.use(express.json());
  app.use(compression());

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', async (req, res, next) => {
      if (!req.url.startsWith('/api')) {
        return res.sendFile('../frontend/build/index.html', { root: __dirname });
      }
      next();
    });
  } else {
    require('dotenv').config();
    app.use(require('cors')());
  }

  app.use(helmet());

  app.use('/health-check', (req, res) => res.status(200).send());
  app.use('/api/v1/public', require('./routes/public'));
  app.use(require('./middlewares/authenticate'));

  app.use('/api/v1/config', require('./routes/config'));
  app.use('/api/v1/user', require('./routes/user'));
  app.use('/api/v1/task', require('./routes/task'));


  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

  await Promise.all([
    utils.initialiseAdmin(),
  ]);

  await app.listen(process.env.PORT);
  console.log('Node server started');
};

main().catch(console.error);
