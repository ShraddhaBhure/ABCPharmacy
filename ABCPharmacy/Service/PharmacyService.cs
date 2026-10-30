using ABCPharmacy.DTO;
using ABCPharmacy.Models;
using ABCPharmacy.Repositories;

namespace ABCPharmacy.Service
{

    public class PharmacyService : IPharmacyService
    {
        private readonly IPharmacyRepository _repository;

        public PharmacyService(IPharmacyRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<Medicine>> GetMedicinesAsync(
            string? search)
        {
            var medicines = await _repository.GetMedicinesAsync();

            if (string.IsNullOrWhiteSpace(search))
            {
                return medicines
                    .OrderBy(m => m.FullName)
                    .ToList();
            }

            var term = search.Trim();

            return medicines
                .Where(m =>
                    m.FullName.Contains(
                        term, StringComparison.OrdinalIgnoreCase)
                    ||
                    m.Brand.Contains(
                        term, StringComparison.OrdinalIgnoreCase))
                .OrderBy(m => m.FullName)
                .ToList();
        }

        public async Task<Medicine> AddMedicineAsync(
            CreateMedicineRequest request)
        {
            var medicine = new Medicine
            {
                FullName = request.FullName.Trim(),

                Notes = request.Notes?.Trim() ?? string.Empty,

                ExpiryDate = request.ExpiryDate,

                Quantity = request.Quantity,

                Price = decimal.Round(request.Price, 2),

                Brand = request.Brand.Trim()
            };

            await _repository.AddMedicineAsync(medicine);

            return medicine;
        }

        public Task<List<Sale>> GetSalesAsync()
        {
            return _repository.GetSalesAsync();
        }

        public async Task<Sale> CreateSaleAsync(
            CreateSaleRequest request)
        {
            var medicine = await _repository.GetMedicineByIdAsync(
                request.MedicineId);

            if (medicine is null)
            {
                throw new KeyNotFoundException(
                    "Medicine was not found.");
            }

            if (medicine.Quantity < request.Quantity)
            {
                throw new InvalidOperationException(
                    "Insufficient stock for this sale.");
            }

            // Reduce available stock
            medicine.Quantity -= request.Quantity;

            await _repository.UpdateMedicineAsync(medicine);

            // Create sale record
            var sale = new Sale
            {
                MedicineId = medicine.Id,

                MedicineName = medicine.FullName,

                QuantitySold = request.Quantity,

                UnitPrice = medicine.Price,

                TotalAmount = decimal.Round(
                    medicine.Price * request.Quantity, 2),

                SoldAt = DateTime.UtcNow
            };

            await _repository.AddSaleAsync(sale);

            return sale;
        }
    }
}
