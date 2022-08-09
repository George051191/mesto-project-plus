import mongoose from 'mongoose';
import NotFoundError from '../errors/not-found';

// eslint-disable-next-line no-unused-vars
const idValidation = (value: string, helpers?: object) => {
  if (!mongoose.isObjectIdOrHexString(value)) {
    throw new NotFoundError('Неверно указаны данные для поиска');
  }
  return value;
};

export default idValidation;
