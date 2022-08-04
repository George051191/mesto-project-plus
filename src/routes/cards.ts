import { Router } from 'express';
import {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards';

const router = Router();

router.get('/', getCard);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

export default router;
