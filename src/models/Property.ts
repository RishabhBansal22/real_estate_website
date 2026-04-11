import mongoose, { Schema, model, models } from 'mongoose';

const PropertySchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  city: {
    type: String,
    enum: ['Delhi', 'Noida', 'Mumbai', 'Gurugram', 'Pune', 'Bangalore'],
    required: [true, 'City is required'],
    default: 'Delhi'
  },
  locality: {
    type: String,
    required: [true, 'Locality is required'],
  },
  location: {
    type: String, // Keeping this for backward comp. Usually City + Locality
    required: [true, 'Location is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  beds: {
    type: Number, // Will act as BHK
    default: 0,
  },
  baths: {
    type: Number,
    default: 0,
  },
  sqft: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    enum: ['Plot', 'Villa', 'Commercial', 'Apartment'],
    required: [true, 'Property type is required'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  highlights: {
    type: [String],
    default: [],
  },
  amenities: {
    type: [String],
    default: ["24/7 Security", "Parking"]
  },
  nearby: {
    type: [{
      name: String,
      category: { type: String, enum: ['School', 'Metro', 'Hospital', 'Mall', 'Pharmacy'] },
      distance: String
    }],
    default: []
  },
  builder: {
    name: { type: String, default: "Empire Developers" },
    experience: { type: String, default: "15+ Years" }
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    default: "This exceptional property offers unparalleled luxury and exclusivity.",
  }
}, {
  timestamps: true,
});

// Create a virtual 'id' field that maps to '_id' as string
PropertySchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
PropertySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete (ret as any)._id;
    delete (ret as any).__v;
    return ret;
  }
});

PropertySchema.set('toObject', {
  virtuals: true,
  transform: (doc, ret) => {
    delete (ret as any)._id;
    delete (ret as any).__v;
    return ret;
  }
});

// Force deletion of model from cache during development to allow schema changes
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Property;
}

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

export default Property;
