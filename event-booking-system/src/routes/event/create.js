import express from 'express';
import Event from '../../models/event';
import User from '../../models/user';
import { isadmin } from '../common/authCheck';

const router = express.Router();


router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', isadmin, (req, res) => {
  res.locals.options.page = 'create';
  res.render('create', res.locals.options);
});

router.post('/', isadmin, (req, res) => {
  let { eventName, summary, address, date, startTime, endTime, fullDesc } = req.body;
  
  // Convert date and time strings to Date objects
  const startDate = new Date(date + 'T' + startTime);
  const endDate = new Date(date + 'T' + endTime);

  Event.create({
    eventName,
    summary,
    address,
    startDate,
    endDate,
    fullDesc
    
  }).then(event => {
    // Update user's history
    User.findOneAndUpdate(
      { username: res.locals.options.username },
      {
        $push: {
          history: {
            action: `Created event <a href="/event/id/${event.eventId}">${event.eventName}</a>`,
            time: Date.now()
          }
        }
      }
    ).then(() => res.status(201).json({ id: event.eventId }))
    .catch(error => {
      console.error('Error updating user history:', error);
      res.status(500).json({ message: 'Error updating user history' });
    });
  }).catch(error => {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error when creating event' });
  });
});

export default router;
