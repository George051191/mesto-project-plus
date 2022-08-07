import express, { Response, NextFunction, Request } from 'express';
import mongoose from 'mongoose';
import { requestLogger, errorLogger } from './middlewares/logger';
import { DEFAULT_ERROR } from './errors/errors_status';
import usersRouter from './routes/users';
import cardRouter from './routes/cards';
import authUserRouter from './routes/authuser';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(requestLogger);
app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/users', authUserRouter);
app.use('/', usersRouter);
app.use('/cards', cardRouter);

app.use(errorLogger);
app.use((
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction,
) => {
  const { statusCode = DEFAULT_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === DEFAULT_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log('We are now on PORT 3000');
});
