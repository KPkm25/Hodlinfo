const express = require('express')
const router = express.Router()
const {fetchDataAndRender} = require('../controllers/mainController.js')

router.get('/',fetchDataAndRender)

module.exports = router