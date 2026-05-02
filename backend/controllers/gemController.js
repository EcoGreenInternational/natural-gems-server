const Gem = require('../models/Gem');


exports.getGems = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.gemType) filter.gemType = new RegExp(req.query.gemType, 'i');
    if (req.query.status) filter.status = req.query.status;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const total = await Gem.countDocuments(filter);
    const gems = await Gem.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ gems, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getGemById = async (req, res) => {
  try {
    const gem = await Gem.findById(req.params.id);
    if (!gem) return res.status(404).json({ message: 'Gem not found' });
    res.json(gem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGemsByType = async (req, res) => {
  try {
    const gems = await Gem.find({
      gemType: new RegExp(req.params.gemType, 'i')
    }).sort({ createdAt: -1 });
    res.json(gems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.createGem = async (req, res) => {
  try {
    const {
      name, category, gemType, price, status, description,
      weight, clarity, size, colour, shapeAndCut,
      treatment, certificate, origin
    } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: 'Name, category, and price are required' });
    }

    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const gem = new Gem({
      name,
      category,
      gemType,
      price: Number(price),
      status: status || 'Available',
      description,
      weight,
      clarity,
      size,
      colour,
      shapeAndCut,
      treatment,
      certificate,
      origin: origin || 'Sri Lanka',
      image: images[0] || '',
      images
    });

    const savedGem = await gem.save();
    res.status(201).json(savedGem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.updateGem = async (req, res) => {
  try {
    const gem = await Gem.findById(req.params.id);
    if (!gem) return res.status(404).json({ message: 'Gem not found' });

    const updates = { ...req.body };
    if (updates.price) updates.price = Number(updates.price);

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => `/uploads/${f.filename}`);
      updates.images = [...(gem.images || []), ...newImages];
      updates.image = updates.images[0];
    }

    const updatedGem = await Gem.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json(updatedGem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.deleteGem = async (req, res) => {
  try {
    const gem = await Gem.findById(req.params.id);
    if (!gem) return res.status(404).json({ message: 'Gem not found' });
    await gem.deleteOne();
    res.json({ message: 'Gem deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getDashboardStats = async (req, res) => {
  try {
    const totalGems     = await Gem.countDocuments();
    const availableGems = await Gem.countDocuments({ status: 'Available' });
    const soldGems      = await Gem.countDocuments({ status: 'Sold' });

    const recentGems = await Gem.find()
      .sort({ createdAt: -1 })
      .limit(10);

    const gemsByCategory = await Gem.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      totalGems,
      availableGems,
      soldGems,
      orders: 0,
      revenue: 0,
      recentGems,
      gemsByCategory,
      recentOrders: []
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
