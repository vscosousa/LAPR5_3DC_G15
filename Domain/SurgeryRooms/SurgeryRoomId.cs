using System;
using DDDSample1.Domain.Shared;

namespace Domain.SurgeryRooms
{
    public class SurgeryRoomId : EntityId
    {
        public SurgeryRoomId(Guid value) : base(value)
        {
        }

        public SurgeryRoomId(String value) : base(value)
        {
        }

        override
        protected  Object createFromString(String text){
            return new Guid(text);
        }

        override
        public String AsString(){
            Guid obj = (Guid) base.ObjValue;
            return obj.ToString();
        }
        
       
        public Guid AsGuid(){
            return (Guid) base.ObjValue;
        }
    }
}
