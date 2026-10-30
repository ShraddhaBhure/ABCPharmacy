using ABCPharmacy.DTO;
using ABCPharmacy.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ABCPharmacy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class SalesController : ControllerBase
    {
        private readonly IPharmacyService _service;

        public SalesController(IPharmacyService service)
        {
            _service = service;
        }

        // GET: api/sales
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var sales = await _service.GetSalesAsync();

            return Ok(sales);
        }

        // POST: api/sales
        [HttpPost]
        public async Task<IActionResult> Create(
            CreateSaleRequest request)
        {
            try
            {
                var sale = await _service.CreateSaleAsync(request);

                return Ok(sale);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
    }
}
