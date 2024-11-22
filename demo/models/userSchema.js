import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  fullName: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true, // Password is required
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email should be unique
  },
  phone: {
    type: [String],
  },
  is_blocked: { type: Boolean, default: false },
  is_varified: { type: Number, default: 0 }, // Consider renaming to 'is_verified'
  is_admin: { type: Number, default: 0 },
  googleId: { type: String },
  createdAt: { type: Date, default: Date.now }, // Automatically set to current date
  updatedAt: { type: Date },
});

// Middleware to update 'updatedAt' before saving
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
