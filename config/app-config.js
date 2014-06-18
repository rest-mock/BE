'use strict';

var path = require('path');

module.exports = {
    DATA_PATH: path.resolve(__dirname, '../app/data/data.json'),
    HTTP_METHODS: [
        'GET',
        'POST',
        'PUT',
        'DELETE'
    ]
};