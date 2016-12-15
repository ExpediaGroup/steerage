'use strict';

const promisify = function (fn, context) {
    if (!fn) {
        return;
    }

    return function (...args) {
        return new Promise((resolve, reject) => {
            fn.apply(context, [...args, (error, result) => {
                error ? reject(error) : resolve(result);
            }]);
        });
    };
};

module.exports = promisify;
