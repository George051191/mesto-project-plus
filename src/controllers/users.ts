import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import SessionRequest from '../utils/interfaces';
import BadRequestError from '../errors/bad_request';
import NotFoundError from '../errors/not-found';

const getAllUsers = (req: SessionRequest, res: Response, next: NextFunction) => User.find({})
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

const getCurrentUser = (req: SessionRequest, res: Response, next: NextFunction) => {
  const id = req.user?._id;

  User.findById(id)
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash: string) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name,
        avatar: user.avatar,
        about: user.about,
        email: user.email,
        _id: user._id,
      },
    }))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          next(new BadRequestError('Переданы некорректные данные'));
          break;
        default: next(err);
      }
    });
};

const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch(next);
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
  getAllUsers, getUserById, createUser, editUserInfo, refreshAvatar, login, getCurrentUser,
};
