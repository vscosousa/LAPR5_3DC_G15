import dotenv from 'dotenv';
import path from 'path';
import patientMedicalHistory from './src/api/routes/patientMedicalHistory';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port : optional change to 4000 by JRT
   */
  port: parseInt(process.env.PORT, 10) || 4000,

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI || "mongodb://mongoadmin:fb2760583afec14f39c8aa64@vs884.dei.isep.ipp.pt:27017/admin",

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || "my sakdfho2390asjod$%jl)!sdjas0i secret",

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  controllers: {
    appointment: {
      name: "AppointmentController",
      path: "../controllers/appointmentController"
    },
    patientMedicalHistory: {
      name: "PatientMedicalHistoryController",
      path: "../controllers/patientMedicalHistoryController"
    },
    specialization: {
      name: "SpecializationController",
      path: "../controllers/specializationController"
    },
    allergy: {
      name: "AllergyController",
      path: "../controllers/allergyController"
    },
    medicalCondition: {
      name: "MedicalConditionController",
      path: "../controllers/medicalConditionController"
    }
  },

  repos: {
    appointment: {
      name: "AppointmentRepo",
      path: "../repos/appointmentRepo"
    },
    patientMedicalHistory: {
      name: "PatientMedicalHistoryRepo",
      path: "../repos/patientMedicalHistoryRepo"
    },
    specialization: {
      name: "SpecializationRepo",
      path: "../repos/specializationRepo"
    },
    allergy: {
      name: "AllergyRepo",
      path: "../repos/allergyRepo"
    },
    medicalCondition: {
      name: "MedicalConditionRepo",
      path: "../repos/medicalConditionRepo"
    }
  },

  services: {
    appointment: {
      name: "AppointmentService",
      path: "../services/appointmentService"
    },
    patientMedicalHistory: {
      name: "PatientMedicalHistoryService",
      path: "../services/patientMedicalHistoryService"
    },
    specialization: {
      name: "SpecializationService",
      path: "../services/specializationService"
    },
    allergy: {
      name: "AllergyService",
      path: "../services/allergyService"
    },
    medicalCondition: {
      name: "MedicalConditionService",
      path: "../services/medicalConditionService"
    }
  },
};