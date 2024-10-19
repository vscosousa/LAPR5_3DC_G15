using System;

namespace DDDSample1.Domain.Patients
{
    public class MedicalRecordNumberGenerator
    {
        public static string GenerateMedicalRecordNumber(int count)
        {
            var currentYear = DateTime.Now.Year;
            var currentMonth = DateTime.Now.Month;
            var sequentialNumber = count + 1;
            return $"{currentYear:D4}{currentMonth}{sequentialNumber:D6}";
        }
    }
}