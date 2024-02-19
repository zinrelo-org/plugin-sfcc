'use strict';

var processInclude = require('base/util');
var currentScript = document.currentScript;

$(document).ready(function () {
    processInclude(require('./zinrelo/zinrelo')(currentScript));
});
