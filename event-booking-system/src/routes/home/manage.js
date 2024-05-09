import express from 'express';
import Event from '../../models/event';
import { parseEvents } from '../common/eventParser';
import { isadmin } from '../common/authCheck';

const router = express.Router();

router.get('/manage-events', isadmin, async (req, res) => {
  try {
    let events, filter_type;
    switch (req.query.filter_type) {
      case 'past':
        events = await Event.find({ startDate: { $lt: new Date() } })
          .sort('startDate');
        filter_type = 'past';
        break;
      case 'upcoming':
        events = await Event.find({ startDate: { $gt: new Date() } })
          .sort('startDate');
        filter_type = 'upcoming';
        break;
      default:
        events = await Event.find({}).sort('startDate');
        filter_type = 'all';
    }
    // Assuming res.locals.options is defined elsewhere
    res.locals.options.events = parseEvents(events); // Check if parseEvents is defined correctly
    res.locals.options.page = 'manage-events';
    res.locals.options.filter_type = filter_type;
    res.render('manage', res.locals.options); // Check if 'manage' view exists and is configured properly
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
