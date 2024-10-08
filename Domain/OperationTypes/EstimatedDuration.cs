using DDDSample1.Domain.Shared;
using DDDSample1.Domain.ValueObjects;

namespace DDDSample1.Domain.OperationTypes
{
    public class EstimatedDuration : IValueObject
    {
        public string Duration { get; private set; }

        public EstimatedDuration(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("Estimated Duration should have a value.");

            Duration = value;
        }

        protected EstimatedDuration()
        {
        }

        public override string ToString() => Duration;

        public override bool Equals(object obj)
        {
            if (obj is not EstimatedDuration estimatedDuration) return false;

            return Duration == estimatedDuration.Duration;
        }

        public override int GetHashCode() => Duration.GetHashCode();
    }
}