import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import idValidation from '../utils/validation';
import {
  getAllUsers, getUserById,
} from '../controllers/users';

const router = Router();

router.get('/users', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getAllUsers);

router.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().custom(idValidation, 'custom validation'),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getUserById);

export default router;
