using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
        public class MedicalConditions : IValueObject
    {
        public string[] Conditions { get; }  // ver regras de negócio

        private MedicalConditions() { }

        public MedicalConditions(string[] conditions)
        {
            Conditions = conditions;
        }

        public override string ToString() => string.Join(", ", Conditions);

        public override bool Equals(object obj)
        {
            if (obj is not MedicalConditions medicalConditions) return false;

            return Conditions == medicalConditions.Conditions;
        }

        public override int GetHashCode() => Conditions.GetHashCode();
    }
}