import { IAppointmentPersistence } from '../../dataschema/IAppointmentPersistence';
import mongoose from 'mongoose';

const Appointment = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true
    },

    requestId: {
      type: String,
      required: [true, 'Please enter request ID'],
      index: true,
    },

    roomId: {
      type: String,
      required: [true, 'Please enter room ID'],
      index: true,
    },

    dateTime: {
      type: Date,
      required: [true, 'Please enter date and time'],
      index: true,
    },

    status: {
      type: String,
      enum: ['scheduled', 'completed', 'canceled'],
      required: [true, 'Please enter status'],
      index: true,
    },
    team: {
      type: [String],
      required: [true, 'Please enter team members'],
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IAppointmentPersistence & mongoose.Document>('Appointment', Appointment);
