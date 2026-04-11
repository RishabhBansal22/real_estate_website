import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  savedProperties: [{
    type: Schema.Types.ObjectId,
    ref: 'Property',
  }],
}, {
  timestamps: true,
});

// Create a virtual 'id' field
UserSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete (ret as any)._id;
    delete (ret as any).__v;
    return ret;
  }
});

const User = models.User || model('User', UserSchema);

export default User;
