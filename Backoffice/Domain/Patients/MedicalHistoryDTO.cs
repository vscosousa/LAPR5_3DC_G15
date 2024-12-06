using Newtonsoft.Json;

namespace DDDSample1.Domain.Patients
{
    public class MedicalHistoryDTO
    {
        [JsonProperty("patientMedicalRecordNumber")]
        public string PatientMedicalRecordNumber { get; init; }

        [JsonProperty("allergies")]
        public string[] Allergies { get; init; }

        [JsonProperty("medicalConditions")]
        public string[] MedicalConditions { get; init; }

        public MedicalHistoryDTO() { }

        public MedicalHistoryDTO(string patientMedicalRecordNumber, string[] allergies, string[] medicalConditions)
        {
            PatientMedicalRecordNumber = patientMedicalRecordNumber;
            Allergies = allergies;
            MedicalConditions = medicalConditions;
        }
    }
}