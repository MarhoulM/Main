using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using meetmeatApi.Services; 
using meetmeatApi.Dtos;    
using System;               
using Microsoft.Extensions.Logging;

namespace meetmeatApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ILogger<EmailController> _logger;

        public EmailController(IEmailService emailService, ILogger<EmailController> logger)
        {
            _emailService = emailService;
            _logger = logger;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _emailService.SendEmailAsync(request);
                _logger.LogInformation($"Email s predmetem '{request.Subject}' uspesne odeslan na '{request.To}'.");
                return Ok(new { Message = "E-mail byl úspěšně odeslán!" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Chyba pri odesilani emailu na {request.To} s predmetem '{request.Subject}'.");
                return StatusCode(500, new { Message = $"Nepodařilo se odeslat e-mail. Chyba: {ex.Message}" });
            }
        }
    }
}
