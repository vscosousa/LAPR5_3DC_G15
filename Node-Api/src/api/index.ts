import { Router } from 'express';
import appointment from './routes/appointmentRoute';

export default () => {
	const app = Router();

  appointment(app);

	return app
}
