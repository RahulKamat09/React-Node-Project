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

const addressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: String }
}, schemaOptions);

addressSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);
export default Address;
