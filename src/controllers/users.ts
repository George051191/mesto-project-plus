import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import SessionRequest from '../utils/interfaces';
import BadRequestError from '../errors/bad_request';
import NotFoundError from '../errors/not-found';

const getAllUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res?.send({ data: users }))
  .catch(next);

const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.findById(req.params.id)
  .then((user) => {
    if (user === null) {
      next(new NotFoundError('Пользователь не найден'));
      return;
    }
    res.send({ data: user });
  })
  .catch((err) => {
    switch (err.name) {
      case 'CastError':
        next(new NotFoundError('Пользователь не найден'));
        break;
      default: next(err);
    }
  });

const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          next(new BadRequestError('Переданы некорректные данные'));
          break;
        default: next(err);
      }
    });
};

const editUserInfo = (req: SessionRequest, res: Response, next:NextFunction) => {
  const id = req.user?._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        next(new NotFoundError('Пользователь не найден'));
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          next(new BadRequestError('Переданы некорректные данные'));
          break;
        case 'CastError':
          next(new NotFoundError('Пользователь не найден'));
          break;
        default: next(err);
      }
    });
};

const refreshAvatar = (req: SessionRequest, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        next(new NotFoundError('Пользователь не найден'));
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          next(new BadRequestError('Переданы некорректные данные'));
          break;
        case 'CastError':
          next(new NotFoundError('Пользователь не найден'));
          break;
        default: next(err);
      }
    });
};

export {
  getAllUsers, getUserById, createUser, editUserInfo, refreshAvatar,
};
