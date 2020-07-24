const express = require('express');
const faq = require('../../Controllers/admin/faq');

const router = express.Router();

router.post('/',faq.createFaq);
router.put('/update',faq.updateFaq);
router.patch('/toggle',faq.toggleBlockedFaq);
router.get('/',faq.getFaq);
router.delete('/',faq.deleteFaq);
router.post('/category',faq.addCategory);
router.post('/search',faq.searchFaq);
router.delete('/category',faq.deleteCategory);
router.put('/category',faq.updateCategory)
module.exports = router;