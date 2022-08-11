import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
import escape from 'escape-html';
import SessionRequest from '../utils/interfaces';
import Card from '../models/card';
import BadRequestError from '../errors/bad_request';
import NotFoundError from '../errors/not-found';
import ForbiddenError from '../errors/forbidden_error';

interface TempRequest extends Request {
  user?: {_id: ObjectId}
}

const getCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (err) {
    next(err);
  }
};

const createCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { name, link, owner } = req.body;
  const shieldName = escape(name);
  Card.create({ name: shieldName, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          next(new BadRequestError(err.errors.link ? err.errors.link.message : 'Переданы некорректные данные'));
          break;
        default: next(err);
      }
    });
};

const deleteCard = async (req: SessionRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const id = req.user?._id;
  try {
    const card = await Card.findById(cardId);
    if (card === null) {
      throw new NotFoundError('Карточка не найдена');
    }
    if (id !== card.owner.toString()) {
      throw new ForbiddenError('Неверные права доступа к файлам');
    }
    await Card.deleteOne({ _id: cardId });
    res.send(card);
  } catch (err:any) {
    switch (err.name) {
      case 'CastError':
        next(new NotFoundError('Карточка не найдена'));
        break;
      default: next(err);
    }
  }
};

const likeCard = (req: SessionRequest, res: Response, next:NextFunction) => {
  const id = req.user?._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card === null) {
        next(new NotFoundError('Карточка не найдена'));
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          next(new BadRequestError('Переданы некорректные данные'));
          break;
        case 'CastError':
          next(new NotFoundError('Карточка не найдена'));
          break;
        default: next(err);
      }
    });
};

const dislikeCard = (req: TempRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id! } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card === null) {
        next(new NotFoundError('Карточка не найдена'));
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          next(new BadRequestError('Переданы некорректные данные'));
          break;
        case 'CastError':
          next(new NotFoundError('Карточка не найдена'));
          break;
        default: next(err);
      }
    });
};

export {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
};
