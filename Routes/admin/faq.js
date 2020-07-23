const express = require('express');
const faq = require('../../Controllers/admin/faq');
const router = express.Router();

router.post('/faq',faq.createFaq);
router.put('/faq/update',faq.updateFaq);
router.patch('/faq/toggle',faq.toggleBlockedFaq);
router.get('/faq',faq.getFaq);
router.delete('/faq',faq.deleteFaq);
router.post('/faq/category',faq.addCategory);
router.post('/faq/search',faq.searchFaq);
router.delete('/faq/category',faq.deleteCategory);
router.put('/faq/category',faq.updateCategory)
module.exports = router;