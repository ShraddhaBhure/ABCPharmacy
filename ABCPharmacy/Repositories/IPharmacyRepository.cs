using ABCPharmacy.Models;

namespace ABCPharmacy.Repositories
{
    public interface IPharmacyRepository
    {
        Task<List<Medicine>> GetMedicinesAsync();

        Task<Medicine?> GetMedicineByIdAsync(Guid id);

        Task AddMedicineAsync(Medicine medicine);

        Task UpdateMedicineAsync(Medicine medicine);

        Task<List<Sale>> GetSalesAsync();

        Task AddSaleAsync(Sale sale);
    }
}
