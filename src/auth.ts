import * as passport from 'koa-passport';
import { User, IUserDocument } from './models/User';

export default passport;

passport.serializeUser((user: IUserDocument, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (dbErr, user: IUserDocument) => {
    done(dbErr, user);
  });
});

import local from './strategies/local';
local(passport);
