const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discountAmount: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Voucher = mongoose.model("Voucher", voucherSchema);

module.exports = Voucher;
