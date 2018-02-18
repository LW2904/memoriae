import * as moment from 'moment';
import * as Router from 'koa-router';

import { User } from '../models/User';
import { Person } from '../models/Person';
import { ifLoggedOn, redirectIfLoggedOn } from '../router';

const router = new Router();
export default router;

router.use(ifLoggedOn);

router.post('/add', async (ctx, next) => {
  const { user } = ctx.state;
  const { firstName, lastName, rawBday, notes } = ctx.request.body;

  const birthday = moment(rawBday);

  user.persons.push(new Person({ firstName, lastName, birthday, notes }));
  await user.save();

  ctx.redirect('back');
});

router.get('/remove/:id', async (ctx, next) => {
  const { user } = ctx.state;

  for (const person of user.persons) {
    if (person.id === ctx.params.id) {
      person.remove();
      await user.save();

      return ctx.success('Removed person.');
    }
  }

  ctx.throw(new Error('Person not found.'));
});
