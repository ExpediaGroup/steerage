'use strict';

const register = (server, options, next) => {
    next();
};

register.attributes = {
    name: 'devPlugin',
    version: '1.0.0'
};

module.exports.register = register;
