import { Router } from 'express';
import { getCard, createCard, deleteCard } from '../controllers/cards';

const router = Router();

router.get('/', getCard);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);

export default router;
