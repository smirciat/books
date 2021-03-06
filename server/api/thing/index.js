'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/', controller.key);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;