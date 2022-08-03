/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import SessionRequest from '../utils/interfaces';
import Card from '../models/card';

const getCard = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch((err) => res?.status(err.status || 500).send({ message: 'Произошла ошибка' }));

const createCard = (req: SessionRequest, res: Response, next: NextFunction) => {
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

const deleteCard = (req: SessionRequest, res: Response, next: NextFunction) => {
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

export { getCard, createCard, deleteCard };
