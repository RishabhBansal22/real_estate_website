import mongoose, { Schema, model, models } from 'mongoose';

const ContactSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  propertyId: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  subject: {
    type: String,
    default: 'General Inquiry',
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'resolved'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

// Create a virtual 'id' field
ContactSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

ContactSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete (ret as any)._id;
    delete (ret as any).__v;
    return ret;
  }
});

const Contact = models.Contact || model('Contact', ContactSchema);

export default Contact;
