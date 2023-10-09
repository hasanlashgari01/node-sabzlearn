const Validator = require('fastest-validator');

const v = new Validator();

const schema = {
    title: { type: 'string', min: 3, max: 255 },
    description: { type: 'string', min: 3 },
    body: { type: 'string', min: 3 },
    href: { type: 'string', min: 3, max: 255, unique: true },
};

const check = v.compile(schema);

module.exports = check;
