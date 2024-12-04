import dotenv from 'dotenv';
import path from 'path';

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
    specialization: {
      name: "SpecializationController",
      path: "../controllers/specializationController"
    }
  },

  repos: {
    appointment: {
      name: "AppointmentRepo",
      path: "../repos/appointmentRepo"
    },
    specialization: {
      name: "SpecializationRepo",
      path: "../repos/specializationRepo"
    }
  },

  services: {
    appointment: {
      name: "AppointmentService",
      path: "../services/appointmentService"
    },
    specialization: {
      name: "SpecializationService",
      path: "../services/specializationService"
    }
  },
};