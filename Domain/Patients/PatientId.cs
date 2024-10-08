using System;
using DDDSample1.Domain.Shared;
using Newtonsoft.Json;

namespace DDDSample1.Domain.Patients
{
    public class PatientId : EntityId
    {
        [JsonConstructor]
        public PatientId(Guid value) : base(value)
        {
        }

        public PatientId(string value) : base(value)
        {
        }

        override
        protected  Object createFromString(string text){
            return new Guid(text);
        }

        override
        public string AsString(){
            Guid obj = (Guid) base.ObjValue;
            return obj.ToString();
        }
        
       
        public Guid AsGuid(){
            return (Guid) base.ObjValue;
        }
    }
}