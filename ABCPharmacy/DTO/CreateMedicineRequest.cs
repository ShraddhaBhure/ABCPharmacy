using System.ComponentModel.DataAnnotations;

namespace ABCPharmacy.DTO
{
    public class CreateMedicineRequest
    {
        [Required]
        [StringLength(120)]
        public string FullName { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Notes { get; set; } = string.Empty;

        public DateOnly ExpiryDate { get; set; }

        [Range(0, 100000)]
        public int Quantity { get; set; }

        [Range(typeof(decimal), "0.01", "999999.99")]
        public decimal Price { get; set; }

        [Required]
        [StringLength(100)]
        public string Brand { get; set; } = string.Empty;
    }
}
