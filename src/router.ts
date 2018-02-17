import * as Router from 'koa-router';

const router = new Router();
export default router;

type INext = () => Promise<any>;

export function ifLoggedOn(ctx: Router.IRouterContext, next: INext) {
  if (ctx.isAuthenticated()) {
    return next();
  } else {
    ctx.redirect('/login');
  }
}

export function redirectIfLoggedOn(
  ctx: Router.IRouterContext,
  next: INext,
) {
  if (ctx.isAuthenticated()) {
    ctx.redirect('/');
  } else {
    return next();
  }
}

router.get('/', async (ctx, next) => {
  await ctx.render('index');
});

import user from './routes/userActions';
router.use(user.routes());
router.use(user.allowedMethods());
