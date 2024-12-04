import { Router } from 'express';
import appointment from './routes/appointmentRoute';
import specialization from './routes/specializationRoute'

export default () => {
	const app = Router();

  appointment(app);
  specialization(app);
  

	return app
}
