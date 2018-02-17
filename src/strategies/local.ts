import { Context } from 'koa';
import { User, IUserDocument } from '../models/User';
import { Strategy as LocalStrategy } from 'passport-local';
import { compare, hashSync, genSaltSync } from 'bcrypt-nodejs';

export default function strategy(passport: any) { // TODO: Dirty.
  passport.use('local-signup', new LocalStrategy({
    passReqToCallback: true, // For flash functionality.
  }, (req: any, name, pass, done) => { // TODO: Dirty.
    const ctx: Context = req.ctx;

    process.nextTick(() => {
      User.findOne({ nickname: name }, (dbErr, user) => {
        if (dbErr) { return done(dbErr); }
        if (user) {
          ctx.flash.set('A user with this name already exists.');
          return done(null, false);
        }
        if (ctx.request.body.second !== pass) {
          ctx.flash.set('The passwords do not match.');
          return done(null, false);
        }

        const newUser = new User({
          nickname: name,
          password: hashSync(pass, genSaltSync(8)),
        });

        newUser.save((saveErr) => done(saveErr, newUser));
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    passReqToCallback: true, // For flash functionality.
  }, (req: any, name, pass, done) => { // TODO: Dirty.
    const ctx: Context = req.ctx;

    process.nextTick(() => {
      User.findOne({ nickname: name }, (dbErr, user) => {
        if (dbErr) { return done(dbErr); }
        if (!user) {
          ctx.flash.set('The given user was not found.');
          return done(null, false);
        }

        compare(pass, user.password, (err, valid: boolean) => {
          if (valid) {
            done(null, user);
          } else {
            ctx.flash.set('The given password is incorrect.');
            done(null, false);
          }
        });
      });
    });
  }));

  return passport;
}
