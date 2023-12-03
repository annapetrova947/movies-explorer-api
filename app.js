const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');

const appRouter = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const { ENV = 'dev' } = process.env;
const { MONGO_URL } = process.env;

mongoose.connect(
  ENV === 'production' ? MONGO_URL : 'mongodb://127.0.0.1:27017/bitfilmsdb',
  {
    useNewUrlParser: true,
  },
);

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use(appRouter);

app.use(errorHandler);
app.use(errors());
app.use(errorLogger);
app.listen(PORT, () => {
  // console.log('App listening port 3000');
});
