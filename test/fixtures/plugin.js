'use strict';

const register = (server, options, next) => {
    next();
};

register.attributes = {
    name: 'testPlugin',
    version: '1.0.0'
};

module.exports.register = register;
