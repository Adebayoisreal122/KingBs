const express = require('express');
const router = express.Router();
const { submitEnquiry, getEnquiries, markAsRead, deleteEnquiry } = require('../controllers/enquiryController');
const { protect } = require('../middleware/auth');

router.post('/', submitEnquiry);
router.get('/', protect, getEnquiries);
router.patch('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteEnquiry);

module.exports = router;
