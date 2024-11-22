import mongoose, { Schema } from "mongoose";

// Define addressSchema
const addressSchema = new mongoose.Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "userCredentials", // Reference to the userCredentials collection
      required: true,
    },
    city: {
      type: String,
      required: false, // Not required
    },
    state: {
      type: String,
      required: false, // Not required
    },
    pincode: {
      type: String,
      required: false, // Not required
    },
    country: {
      type: String,
      required: false, // Not required
    },
    created_at: {
      type: Date,
      default: Date.now, // Automatically set the date when the document is created
    },
    updated_at: {
      type: Date,
      default: Date.now, // Automatically set the date when the document is created
    },
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

// Create addressModel
export const Address = mongoose.model("Address", addressSchema);
