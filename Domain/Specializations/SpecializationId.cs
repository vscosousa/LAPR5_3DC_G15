using System;
using DDDSample1.Domain.Shared;
using Newtonsoft.Json;

namespace DDDSample1.Domain.Specializations
{
    public class SpecializationId : EntityId
    {
        [JsonConstructor]
        public SpecializationId(Guid value) : base(value)
        {
        }

        public SpecializationId() : base(Guid.NewGuid())
        {
        }

        public SpecializationId(string value) : base(value)
        {
        }

        override
        protected object createFromString(string text)
        {
            return new Guid(text);
        }

        override
        public string AsString()
        {
            Guid obj = (Guid) base.ObjValue;
            return obj.ToString();
        }

        public Guid AsGuid()
        {
            return (Guid) base.ObjValue;
        }
    }
}
