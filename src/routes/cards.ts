import { Router } from 'express';
import mongoose from 'mongoose';
import { celebrate, Joi } from 'celebrate';
import NotFoundError from '../errors/not-found';
import {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards';

// eslint-disable-next-line no-unused-vars
const idValidation = (value: string, helpers?: object) => {
  if (!mongoose.isObjectIdOrHexString(value)) {
    throw new NotFoundError('Карточка не найдена');
  }
  return value;
};

const router = Router();

router.get('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getCard);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/(www\.)?[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=]+/),
    owner: Joi.string().required(),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(idValidation, 'custom validation'),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(idValidation, 'custom validation'),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(idValidation, 'custom validation'),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), dislikeCard);

export default router;
