import express, { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
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

app.listen(PORT, () => {
  console.log('We are now on PORT 3000');
});
