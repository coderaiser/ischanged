'use strict';

const {
    run
} = require('madrun');

module.exports = {
    'fix:lint': () => run('lint', '--fix'),
    'lint': () => 'putout lib .madrun.js'
};

