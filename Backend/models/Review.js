import mongoose from 'mongoose';

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    }
  },
  toObject: { virtuals: true }
};

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: String },
  adminReply: { type: String, default: "" }
}, schemaOptions);

reviewSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
