const express = require('express');
const { createLead } = require('../controllers/leadcontroller');
const router = express.Router();


// POST /api/leads
router.post('/', createLead);

module.exports = router;
