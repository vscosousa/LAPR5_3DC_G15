// filepath: /c:/Projetos/LAPR5_3DC_G15/Node-Api/config.js
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

let databaseURL = process.env.MONGODB_URI || "mongodb://mongoadmin:fb2760583afec14f39c8aa64@vs884.dei.isep.ipp.pt:27017/admin";

const getDatabaseURL = async () => {
  if (process.env.NODE_ENV === 'test') {
    const mongoServer = await MongoMemoryServer.create();
    return mongoServer.getUri();
  }
  return databaseURL;
};

const config = {
  /**
   * Your favorite port : optional change to 4000 by JRT
   */
  port: parseInt(process.env.PORT, 10) || 4000,

  /**
   * That long string from mlab
   */
  databaseURL: databaseURL,

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || "your-very-secure-key-that-is-at-least-256-bits-long",

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
    },
    roomType: {
      name: 'RoomTypeController',
      path: "../controllers/roomTypeController"
    },
    room: {
      name: 'RoomController',
      path: "../controllers/roomController"
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
    },
    roomType: {
      name: 'RoomTypeRepo',
      path: "../repos/roomTypeRepo"
    },
    room: {
      name: 'RoomRepo',
      path: "../repos/roomRepo"
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
    },
    roomType: {
      name: 'RoomTypeService',
      path: "../services/roomTypeService"
    },
    room: {
      name: 'RoomService',
      path: "../services/roomService"
    }
  },
};

export default config;