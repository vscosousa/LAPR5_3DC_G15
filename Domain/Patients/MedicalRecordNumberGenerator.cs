namespace DDDSample1.Domain.Patients
{
    public class MedicalRecordNumberGenerator
    {
        private const string Prefix = "PAT";

        public static string GenerateMedicalRecordNumber(int count)
        {
            var medicalRecordNumber = count + 1;
            return $"{Prefix}{medicalRecordNumber:D6}";
        }
    }
}