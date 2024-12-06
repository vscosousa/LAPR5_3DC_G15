import { Router } from 'express';
import appointment from './routes/appointmentRoute';
import patientMedicalHistory from './routes/patientMedicalHistory';
import specialization from './routes/specializationRoute';
import allergy from './routes/allergyRoute';
import medicalCondition from './routes/medicalConditionRoute';

export default () => {
	const app = Router();

  appointment(app);
  patientMedicalHistory(app);
  specialization(app);
  allergy(app);
  medicalCondition(app);

	return app
}
