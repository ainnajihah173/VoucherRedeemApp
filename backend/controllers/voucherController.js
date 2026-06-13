const Voucher = require("../models/Voucher");

// Create a new voucher
exports.createVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.create(req.body);
    res.status(201).json(voucher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Read vouchers (with optional category filter)
exports.getVouchers = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const list = await Voucher.find(filter).populate("category");
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Read one voucher by ID
exports.getVoucherById = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id).populate("category");
    if (!voucher) return res.status(404).json({ message: "Voucher not found" });
    res.status(200).json(voucher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a voucher
exports.updateVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(voucher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
