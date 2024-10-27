using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationRequests
{
    public class OperationRequestId : EntityId
    {
        public OperationRequestId(Guid value) : base(value)
        {
        }

        public override string AsString() => Value.ToString();

        protected override OperationRequestId createFromString(string value)
        {
            return new OperationRequestId(Guid.Parse(value));
        }

        internal Guid AsGuid()
        {
            throw new NotImplementedException();
        }
    }
}
