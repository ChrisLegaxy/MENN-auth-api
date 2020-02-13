import { check, body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

class RegisterValidator {
  public static validationRules(): any {
    return [
      body('username')
        .notEmpty()
        .withMessage('Email cannot be blank')
        .isEmail()
        .withMessage('Email is not valid'),
      body('password')
        .notEmpty()
        .withMessage('Password cannot be blank')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
      body('confirmPassword')
        .notEmpty()
        .withMessage('Confirmation password cannot be blank')
        /**
         * Custom function is used to compare if password is equals to confirmPassword
         *
         * We can't use equals function as we can't access req object
         *
         * @param {string} value - value that we got from body('confirmPassword')
         * @param {object} { req } - an optional req object that cannot be type defined as it will execute
         *                           during runtime, the server will know and get req object to return req.body.password
         */
        .custom((value, { req }) => {
          if (value != req.body.password) {
            throw new Error("Passwords don't match");
          } else {
            return value;
          }
        })
        .withMessage('Confirmation password does not match')
    ];
  }

  public static validate(req: Request, res: Response, next: NextFunction): any {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }
    const extractedErrors: Array<any> = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
      success: false,
      status: 422,
      extractedErrors
    });
  }
}

export default RegisterValidator;