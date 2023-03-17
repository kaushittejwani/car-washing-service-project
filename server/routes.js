import userRouter from './api/v1/controllers/user/routes';
import adminRouter from './api/v1/controllers/admin/routes'

/**
 *
 *
 * @export
 * @param {any} app
 */
export default function routes(app) {
    app.use('/v1/user', userRouter);
    app.use('/v1/admin',adminRouter,)
    return app;
}