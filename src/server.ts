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

import router from './router';
app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(8080);
