using ABCPharmacy.Models;
using System.Text.Json;

namespace ABCPharmacy.Repositories
{
    public class PharmacyRepository: IPharmacyRepository
    {
        private readonly string _medicinesPath;
        private readonly string _salesPath;

        private readonly SemaphoreSlim _fileLock = new(1, 1);

        private readonly JsonSerializerOptions _jsonOptions =
            new() { WriteIndented = true };

        public PharmacyRepository(IWebHostEnvironment environment)
        {
            var dataDirectory = Path.Combine(
                environment.ContentRootPath, "Data");

            Directory.CreateDirectory(dataDirectory);

            _medicinesPath = Path.Combine(
                dataDirectory, "medicines.json");

            _salesPath = Path.Combine(
                dataDirectory, "sales.json");

            EnsureFileExists(_medicinesPath);
            EnsureFileExists(_salesPath);
        }

        public async Task<List<Medicine>> GetMedicinesAsync()
        {
            await _fileLock.WaitAsync();

            try
            {
                return await ReadAsync<Medicine>(_medicinesPath);
            }
            finally
            {
                _fileLock.Release();
            }
        }

        public async Task<Medicine?> GetMedicineByIdAsync(Guid id)
        {
            var medicines = await GetMedicinesAsync();

            return medicines.FirstOrDefault(m => m.Id == id);
        }

        public async Task AddMedicineAsync(Medicine medicine)
        {
            await _fileLock.WaitAsync();

            try
            {
                var medicines = await ReadAsync<Medicine>(_medicinesPath);

                medicines.Add(medicine);

                await WriteAsync(_medicinesPath, medicines);
            }
            finally
            {
                _fileLock.Release();
            }
        }

        public async Task UpdateMedicineAsync(Medicine medicine)
        {
            await _fileLock.WaitAsync();

            try
            {
                var medicines = await ReadAsync<Medicine>(_medicinesPath);

                var index = medicines.FindIndex(
                    m => m.Id == medicine.Id);

                if (index >= 0)
                {
                    medicines[index] = medicine;

                    await WriteAsync(_medicinesPath, medicines);
                }
            }
            finally
            {
                _fileLock.Release();
            }
        }

        public async Task<List<Sale>> GetSalesAsync()
        {
            await _fileLock.WaitAsync();

            try
            {
                return await ReadAsync<Sale>(_salesPath);
            }
            finally
            {
                _fileLock.Release();
            }
        }

        public async Task AddSaleAsync(Sale sale)
        {
            await _fileLock.WaitAsync();

            try
            {
                var sales = await ReadAsync<Sale>(_salesPath);

                sales.Add(sale);

                await WriteAsync(_salesPath, sales);
            }
            finally
            {
                _fileLock.Release();
            }
        }

        private void EnsureFileExists(string path)
        {
            if (!File.Exists(path))
            {
                File.WriteAllText(path, "[]");
            }
        }

        private async Task<List<T>> ReadAsync<T>(string path)
        {
            var json = await File.ReadAllTextAsync(path);

            return JsonSerializer.Deserialize<List<T>>(
                json, _jsonOptions) ?? new List<T>();
        }

        private async Task WriteAsync<T>(
            string path, List<T> data)
        {
            var json = JsonSerializer.Serialize(
                data, _jsonOptions);

            await File.WriteAllTextAsync(path, json);
        }
    }
}
