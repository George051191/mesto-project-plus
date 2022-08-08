/* eslint-disable no-unused-vars */
import {
  model, Model, Schema, Document,
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import NotFoundError from '../errors/not-found';
import AuthError from '../errors/auth_error';

interface IUser {
  name: string,
  about: string,
  avatar: string,
  email: string,
  password: string
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const userShema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    validate: {
      validator(v: string) {
        return validator.isEmail(v);
      },
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
});

userShema.index({ email: 1 }, { unique: true });

userShema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password').then((user: IUser) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new AuthError('Неправильные почта или пароль');
      }

      return user;
    });
  });
});

export default model<IUser, UserModel>('User', userShema);
