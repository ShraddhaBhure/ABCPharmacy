using System.ComponentModel.DataAnnotations;

namespace ABCPharmacy.DTO
{

    public class CreateSaleRequest
    {
        [Required]
        public Guid MedicineId { get; set; }

        [Range(1, 100000)]
        public int Quantity { get; set; }
    }
}
