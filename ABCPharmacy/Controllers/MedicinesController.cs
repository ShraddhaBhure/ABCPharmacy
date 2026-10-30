using ABCPharmacy.DTO;
using ABCPharmacy.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ABCPharmacy.Controllers
{

    [Route("api/[controller]")]
    [ApiController]

    public class MedicinesController : ControllerBase
    {
        private readonly IPharmacyService _service;

        public MedicinesController(IPharmacyService service)
        {
            _service = service;
        }

        // GET: api/medicines
        // GET: api/medicines?search=para
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search)
        {
            var medicines = await _service.GetMedicinesAsync(search);

            return Ok(medicines);
        }

        // POST: api/medicines
        [HttpPost]
        public async Task<IActionResult> Create(
            CreateMedicineRequest request)
        {
            var medicine = await _service.AddMedicineAsync(request);

            return Created("/api/medicines", medicine);
        }
    }
}
