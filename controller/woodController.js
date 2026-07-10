const Wood = require("../model/wood");

// Each function handles one operation. `exports.name` makes it importable.
exports.createWood = async (req, res) => {
  try {
    const wood = await Wood.create(req.body);
    res.status(201).json(wood);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
 
exports.getWoods = async (req, res) => {
  const woods = await Wood.find().sort({ createdAt: -1 });
  res.json(woods);
};

exports.getWood = async (req, res) => {
  const wood = await Wood.findById(req.params.id);
  if (!wood) return res.status(404).json({ error: "Wood not found" });
  res.json(wood);
};

exports.updateWood = async (req, res) => {
  const wood = await Wood.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!wood) return res.status(404).json({ error: "Wood not found" });
  res.json(wood);
};

exports.deleteWood = async (req, res) => {
  const wood = await Wood.findByIdAndDelete(req.params.id);
  if (!wood) return res.status(404).json({ error: "Wood not found" });
  res.json({ message: "Wood deleted", id: req.params.id });
};