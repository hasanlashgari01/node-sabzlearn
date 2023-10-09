const Validator = require('fastest-validator');

const v = new Validator();

const schema = {
    email: { type: 'string', min: 3, max: 255 },
};

const check = v.compile(schema);

module.exports = check;
