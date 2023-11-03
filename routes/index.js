const express = require('express');

const router = express.Router();

router.get('/', (req, res) => res.render("Welcome"))


// const express = require('express');
// const router = express.Router();



module.exports = router;