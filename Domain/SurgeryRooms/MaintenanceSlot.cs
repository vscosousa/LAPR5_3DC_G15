using Domain.Appointments;
using System;
using DDDSample1.Domain.Shared;

public class MaintenanceSlot : IValueObject
    {
        public DateTime Date { get; private set; }
        public TimeSpan StartTime { get; private set; }
        public TimeSpan EndTime { get; private set; }

        // Constructor to create a valid MaintenanceSlot object
        public MaintenanceSlot(DateTime date, TimeSpan startTime, TimeSpan endTime)
        {
            if (date.Date < DateTime.Today)
                throw new BusinessRuleValidationException("The date cannot be in the past.");

            if (startTime >= endTime)
                throw new BusinessRuleValidationException("Start time must be before end time.");

            Date = date;
            StartTime = startTime;
            EndTime = endTime;
        }
    }