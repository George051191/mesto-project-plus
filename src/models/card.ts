import mongoose from 'mongoose';

interface ICard {
  name: string,
  link: string,
  owner: mongoose.Schema.Types.ObjectId,
  likes:mongoose.Schema.Types.ObjectId[] | never[],
  createdAt: Date,
}

const cardShema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: [{ type: mongoose.Schema.Types.ObjectId }],
      ref: 'user',
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model<ICard>('card', cardShema);
