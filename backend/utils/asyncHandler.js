const { NextFunction, Request, Response } = require("express");

/**
 * **Wrapper function**
 * if some error occurs inside then,
 * it will be sent to next middleware _(error handler middleware)_
 */
exports.asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((error) => next(error));
    };
};