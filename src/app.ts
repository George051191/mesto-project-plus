import express, { Response, NextFunction, Request } from 'express';
import mongoose from 'mongoose';
import { DEFAULT_ERROR } from './errors/errors_status';
import usersRouter from './routes/users';
import cardRouter from './routes/cards';
import SessionRequest from './utils/interfaces';
import authUserRouter from './routes/authuser';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use('/', usersRouter);

app.use((req:SessionRequest, res:Response, next:NextFunction) => {
  req.user = {
    _id: '62e959b092d6dc361f6d49eb',
  };

  next();
});

app.use('/cards', cardRouter);
app.use('/users', authUserRouter);

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
