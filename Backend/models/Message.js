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

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: String },
  status: { type: String, default: "unread" }
}, schemaOptions);

messageSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;
