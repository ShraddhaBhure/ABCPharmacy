using ABCPharmacy.DTO;
using ABCPharmacy.Models;

namespace ABCPharmacy.Service
{

    public interface IPharmacyService
    {
        Task<List<Medicine>> GetMedicinesAsync(string? search);

        Task<Medicine> AddMedicineAsync(
            CreateMedicineRequest request);

        Task<List<Sale>> GetSalesAsync();

        Task<Sale> CreateSaleAsync(
            CreateSaleRequest request);
    }
}
