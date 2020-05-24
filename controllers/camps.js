// @desc Get all camps
// @route GET /api/v1/camps
// @access Public
exports.getCamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all camps' });
};

// @desc Get a single camp
// @route GET /api/v1/camps/:id
// @access Public
exports.getCamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Display camp ${req.params.id}` });
};

// @desc Create new camp
// @route POST /api/v1/camps
// @access Private
exports.createCamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create new camp' });
};

// @desc Update camp
// @route PUT /api/v1/camps/:id
// @access Private
exports.updateCamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Update camp ${req.params.id}` });
};

// @desc Delete camp
// @route DELETE /api/v1/camps/:id
// @access Private
exports.deleteCamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Delete camp ${req.params.id}` });
};
