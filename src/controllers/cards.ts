import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import SessionRequest from '../utils/interfaces';
import Card from '../models/card';

interface TempRequest extends Request {
  user?: {_id: ObjectId}
}

const getCard = (req: Request, res: Response) => Card.find({}).populate('owner')
  .then((cards) => res.send({ data: cards }))
  .catch((err) => res?.status(err.status || 500).send({ message: 'Произошла ошибка' }));

const createCard = (req: SessionRequest, res: Response) => {
  const { name, link, owner } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Неизвестная ошибка' });
    });
};

const deleteCard = (req: SessionRequest, res: Response) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.status(500).send({ message: 'Неизвестная ошибка' });
    });
};

const likeCard = (req: SessionRequest, res: Response) => {
  const id = req.user?._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: id } },
    { new: true, runValidators: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          res.status(400).send({ message: 'Переданы некорректные данные' });
          break;
        case 'CastError':
          res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
          break;
        default: res.status(err.status || 500).send({ message: err.message });
      }
    });
};

const dislikeCard = (req: TempRequest, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id! } },
    { new: true, runValidators: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          res.status(400).send({ message: 'Переданы некорректные данные' });
          break;
        case 'CastError':
          res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
          break;
        default: res.status(err.status || 500).send({ message: err.message });
      }
    });
};

export {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
};
