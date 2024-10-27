using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Logs
{
    public class AuditLog : Entity<LogId>, IAggregateRoot
    {
        private string _userId;
        private TypeOfAction _typeOfAction;
        private string _entityId;
        private DateTime _dateTime;
        private string _message;
        private string _changes;

        public AuditLog()
        {
            Id = new LogId(Guid.NewGuid());
            _dateTime = DateTime.Now;
        }

        public string UserId 
        { 
            get => _userId;
            set => _userId = value;
        }
        
        public TypeOfAction TypeOfAction
        {
            get => _typeOfAction;
            set => _typeOfAction = value;
        }

        public string EntityId
        {
            get => _entityId;
            set => _entityId = value;
        }

        public DateTime DateTime
        {
            get => _dateTime;
            set => _dateTime = value;
        }

        public string Message
        {
            get => _message;
            set => _message = value;
        }

        public string Changes
        {
            get => _changes;
            set => _changes = value;
        }
    }
}
