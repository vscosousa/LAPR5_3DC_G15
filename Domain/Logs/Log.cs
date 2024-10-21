using System;
using DDDSample1.Domain.Shared;
namespace DDDSample1.Domain.Logs
{
    public class Log: Entity<LogId>, IAggregateRoot
    {
        private TypeOfAction _typeOfAction;
        private string _entityId;
        private DateTime _dateTime;
        private string _message;
        private Log()
        {
        }
        public Log(TypeOfAction typeOfAction, string entityId, string message)
        {
            Id = new LogId(Guid.NewGuid());
            _typeOfAction = typeOfAction;
            _entityId = entityId;
            _dateTime = DateTime.Now;
            _message = message;
        }
        public TypeOfAction TypeOfAction => _typeOfAction;
        public string EntityId => _entityId;
        public DateTime DateTime => _dateTime;
        public string Message => _message;
    }
}