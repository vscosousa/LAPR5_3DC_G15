using System;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using System.Linq;
using DDDSample1.Domain.OperationTypes;
using Event = Domain.SurgeryRooms.SurgeryRoomEvent; // Add this line with other using statements

namespace Domain.SurgeryRooms
{
    public enum RoomStatus
    {
        Available,
        Occupied,
        UnderMaintenance
    }

    public class SurgeryRoom : DDDSample1.Domain.Shared.Entity<SurgeryRoomId>, IAggregateRoot
    {
        private int _number;
        private string _type;
        private int _capacity;
        private List<string> _equipment;
        private List<MaintenanceSlot> _maintenanceSlots;
        private List<Event> _scheduledEvents;
        private RoomStatus _status;
        private List<string> _assignedEquipment;
        public bool IsActive { get; set; }

        public SurgeryRoom(int number, string type, int capacity, List<string> equipment, List<string> assignedEquipment)
        {
            Id = new SurgeryRoomId(Guid.NewGuid());
            _number = number;
            _type = type;
            _capacity = capacity;
            _equipment = equipment ?? new List<string>();
            _maintenanceSlots = new List<MaintenanceSlot>();
            _scheduledEvents = new List<Event>();
            _status = RoomStatus.Available;  // Default status
            _assignedEquipment = assignedEquipment ?? new List<string>();
        }

        public int Number => _number;
        public string Type => _type;
        public int Capacity => _capacity;
        public IReadOnlyList<string> Equipment => _equipment.AsReadOnly();
        public List<MaintenanceSlot> MaintenanceSlots => _maintenanceSlots;
        public IReadOnlyList<Event> ScheduledEvents => _scheduledEvents.AsReadOnly();
        public RoomStatus Status => _status;
        public List<string> AssignedEquipment => _assignedEquipment;

        public void UpdateNumber(int number)
        {
            if (number <= 0)
                throw new BusinessRuleValidationException("Room number cannot be empty.");
            _number = number;
        }

        public void UpdateType(string type)
        {
            if (string.IsNullOrWhiteSpace(type))
                throw new BusinessRuleValidationException("Room type cannot be empty.");
            _type = type;
        }

        public void UpdateCapacity(int capacity)
        {
            if (capacity <= 0)
                throw new BusinessRuleValidationException("Capacity must be positive.");
            _capacity = capacity;
        }

        public void UpdateEquipment(List<string> equipment)
        {
            if (equipment == null)
                throw new BusinessRuleValidationException("Equipment cannot be null.");
            _equipment = equipment;
        }

        public void UpdateMaintenanceSlots(List<MaintenanceSlot> maintenanceSlots)
        {
            if (maintenanceSlots == null)
                throw new BusinessRuleValidationException("Maintenance slots cannot be null.");
            _maintenanceSlots = maintenanceSlots;
        }

        public bool IsAvailable(DateTime startTime, DateTime endTime)
        {
            // Check if there are any overlapping events
            bool hasOverlappingEvents = _scheduledEvents.Any(e => 
                (startTime < e.EndTime && e.StartTime < endTime));

            // Check if there are any maintenance slots during this time
            bool hasMaintenanceConflict = _maintenanceSlots.Any(m => 
                startTime.TimeOfDay < m.EndTime && m.StartTime < endTime.TimeOfDay);

            return !hasOverlappingEvents && !hasMaintenanceConflict;
        }

        public void ScheduleEvent(Event newEvent)
        {
            if (newEvent == null)
                throw new BusinessRuleValidationException("Event cannot be null.");

            // Check if room is available for the requested time slot
            if (!IsAvailable(newEvent.StartTime, newEvent.EndTime))
                throw new BusinessRuleValidationException("Room is not available for the requested time slot.");

            _scheduledEvents.Add(newEvent);
        }

        public void UpdateStatus(RoomStatus status)
        {
            _status = status;
        }

        public bool CanHandleOperationType(OperationTypeId operationTypeId)
        {
            return _type.Equals(operationTypeId.ToString(), StringComparison.OrdinalIgnoreCase);
        }
    }
}
