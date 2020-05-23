const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'Show all camps' });
});
router.get('/:id', (req, res) => {
  res.status(200).json({ success: true, msg: `Display camp ${req.params.id}` });
});
router.post('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'Create new camp' });
});
router.put('/:id', (req, res) => {
  res.status(200).json({ success: true, msg: `Update camp ${req.params.id}` });
});
router.delete('/:id', (req, res) => {
  res.status(200).json({ success: true, msg: `Delete camp ${req.params.id}` });
});

module.exports = router;
