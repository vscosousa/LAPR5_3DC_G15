using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Domain.SurgeryRooms
{
    public class CreatingSurgeryRoomDTO
    {
        [Required]
        public int Number { get; set; }

        [Required]
        public string Type { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Capacity must be greater than 0")]
        public int Capacity { get; set; }

        [Required]
        public List<string> AssignedEquipment { get; set; }

        [Required]
        public string Status { get; set; }
    }
}
