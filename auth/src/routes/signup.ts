import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from '../errors/request-validation-errors';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signup', [body('email').isEmail().withMessage('Email address must be valid'), body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters')], async (request: Request, response: Response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    const { email, password } = request.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new BadRequestError('Email in use, try another one!');
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        process.env.JWT_KEY!
    );

    // store it on session object
    request.session = {
        jwt: userJwt,
    };

    response.status(201).send(user);
});

export { router as signupRouter };
