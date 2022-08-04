import { Request, Response } from 'express';
import User from '../models/user';
import SessionRequest from '../utils/interfaces';

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

const editUserInfo = (req: SessionRequest, res: Response) => {
  const id = req.user?._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          res.status(400).send({ message: 'Переданы некорректные данные' });
          break;
        case 'CastError':
          res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
          break;
        default: res.status(err.status || 500).send({ message: err.message });
      }
    });
};

const refreshAvatar = (req: SessionRequest, res: Response) => {
  const id = req.user?._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          res.status(400).send({ message: 'Переданы некорректные данные' });
          break;
        case 'CastError':
          res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
          break;
        default: res.status(err.status || 500).send({ message: err.message });
      }
    });
};

export {
  getAllUsers, getUserById, createUser, editUserInfo, refreshAvatar,
};
