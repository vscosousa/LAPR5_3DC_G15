using System;

namespace DDDSample1.Domain.Staffs
{
    public class LicenseNumberGenerator
    {
        public static string GenerateLicenseNumber(int count)
        {
            var currentYear = DateTime.Now.Year;
            var currentMonth = DateTime.Now.Month;
            var sequentialNumber = count + 1;
            return $"1{currentYear:D4}{currentMonth:D2}{sequentialNumber:D5}";
        }
    }
}