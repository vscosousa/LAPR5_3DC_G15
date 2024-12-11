import { Router } from 'express';
import { errors } from 'celebrate';
import appointment from './routes/appointmentRoute';
import patientMedicalHistory from './routes/patientMedicalHistoryRoute';
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

  app.use(errors());

  app.use((err, req, res, next) => {
    if (err.joi) {
      res.status(400).json({
        type: err.type,
        message: err.joi.message,
        details: err.joi.details
      });
    } else {
      next(err);
    }
  });

  return app;
};