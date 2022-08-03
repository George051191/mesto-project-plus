import { Request, Response } from 'express';
import User from '../models/user';

const getAllUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res?.send({ data: users }))
  .catch((err) => res?.status(err.status || 500).send({ message: 'Произошла ошибка' }));

const getUserById = (req: Request, res: Response) => User.findById(req.params.id)
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
    }
    return res.status(500).send({ message: 'Неизвестная ошибка' });
  });

const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }

      return res.status(500).send({ message: 'Неизвестная ошибка' });
    });
};

export { getAllUsers, getUserById, createUser };
