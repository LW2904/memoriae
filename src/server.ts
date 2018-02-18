import { config as configure } from 'dotenv';
configure();

import * as logger from 'debug';
const debug = logger('server');

import * as Koa from 'koa';
const app = new Koa();

app.proxy = true;
app.keys = [ process.env.SESSION_SECRET ];

import * as log from 'koa-logger';
app.use(log());

import * as session from 'koa-session';
import * as bodyParser from 'koa-bodyparser';
app.use(bodyParser());
app.use(session({}, app));

import flash from './middleware/flash';
app.use(flash());

import passport from './auth';
app.use(passport.initialize());
app.use(passport.session());

app.use(async (ctx, next) => {
  if (ctx.request.url.includes('/memoriae')) {
    ctx.redirect(ctx.request.url.replace('/memoriae', ''));
  } else { await next(); }
});

import { join } from 'path';
import * as serve from 'koa-static';
app.use(serve(join(__dirname, '/public')));

import * as views from 'koa-views';
app.use(async (ctx, next) => {
  await views(
    join(__dirname, '/views'), {
      extension: 'ejs',
      options: {
        node: process.version,
        back: ctx.request.get('referer') || '/',
        version: require('../package.json').version,
      },
    },
  )(ctx, next);
});

app.use(async (ctx, next) => {
  ctx.success = async (data: any) => {
    let obj: any = { status: 'success' };

    if (typeof data === 'string') {
      obj.message = data;
    } else if (typeof data === 'object') {
      obj = Object.assign(obj, data); // Merge objects.
    } else { obj = data; }

    return await ctx.render('status', obj);
  };

  await next();
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    app.emit('error', err);

    ctx.status = ctx.status || 500;
    await ctx.render('status', {
      message: err.message,
    });
  }
});

import router from './router';
app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT || '8080';
const server = app.listen(port);
debug('server listening on %o', port);

const { DB_URL, DB_PASS, DB_USER } = process.env;
if (!(DB_URL && DB_PASS && DB_USER)) {
  throw new Error('Missing database connection parameters.');
}

import * as mongoose from 'mongoose';
mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_URL}`)
  .then(() => debug('connected to database'))
  .catch((err) => debug('database connection error: %O', err.message));
