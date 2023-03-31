import userRouter from './api/v1/controllers/user/routes';
import adminRouter from './api/v1/controllers/admin/routes'
import stripe from './api/v1/controllers/stripe/routes'

/**
 *
 *
 * @export
 * @param {any} app
 */
export default function routes(app) {
    app.use('/v1/user', userRouter);
    app.use('/v1/admin',adminRouter,)
    app.use('/checkout',stripe)
    return app;
}