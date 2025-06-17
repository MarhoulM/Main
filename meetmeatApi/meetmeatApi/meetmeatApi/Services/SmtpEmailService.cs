using meetmeatApi.Dtos;
using Microsoft.Extensions.Configuration; 
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Net.Mail; 
using System.Threading.Tasks;

namespace meetmeatApi.Services
{
    public class SmtpEmailService : IEmailService
    {

        private readonly IConfiguration _configuration;
        private readonly ILogger<SmtpEmailService> _logger;
        private readonly string _smtpHost;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;
        private readonly string _fromEmail;

        public SmtpEmailService(IConfiguration configuration, ILogger<SmtpEmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;

            // Nacteni konfigurace SMTP serveru z appsettings.json
            _smtpHost = _configuration["SmtpSettings:Host"] ?? throw new ArgumentNullException("SmtpSettings:Host je vyžadován.");
            _smtpPort = _configuration.GetValue<int>("SmtpSettings:Port");
            _smtpUsername = _configuration["SmtpSettings:Username"] ?? throw new ArgumentNullException("SmtpSettings:Username je vyžadován.");
            _smtpPassword = _configuration["SmtpSettings:Password"] ?? throw new ArgumentNullException("SmtpSettings:Password je vyžadován.");
            _fromEmail = _configuration["SmtpSettings:FromEmail"] ?? throw new ArgumentNullException("SmtpSettings:FromEmail je vyžadován.");

            _logger.LogInformation($"SMTP nastavení načteno: Host={_smtpHost}, Port={_smtpPort}, Uživatel={_smtpUsername}, Od={_fromEmail}");
        }

        public async Task SendEmailAsync(EmailRequestDto emailRequest)
        {
            using (var message = new MailMessage())
            {
                message.From = new MailAddress(_fromEmail);
                message.To.Add(emailRequest.To);
                message.Subject = emailRequest.Subject;
                message.Body = emailRequest.Body;
                message.IsBodyHtml = true;

                using (var client = new SmtpClient(_smtpHost, _smtpPort))
                {
                    client.EnableSsl = true; 
                    client.UseDefaultCredentials = false; 
                    client.Credentials = new NetworkCredential(_smtpUsername, _smtpPassword); 
                    client.DeliveryMethod = SmtpDeliveryMethod.Network;

                    try
                    {
                        await client.SendMailAsync(message);
                        _logger.LogInformation($"E-mail uspesne odeslan na: {emailRequest.To} s predmetem: '{emailRequest.Subject}' pomoci SmtpClient.");
                    }
                    catch (SmtpException ex)
                    {
                        _logger.LogError(ex, $"Chyba SMTP pri odesilani e-mailu na {emailRequest.To} s predmetem '{emailRequest.Subject}': {ex.Message}");
                        throw new Exception("Chyba SMTP pri odesilani e-mailu. Zkontrolujte nastaveni serveru a prihlasovaci udaje.", ex);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Necekana chyba pri odesilani e-mailu na {emailRequest.To} s predmetem '{emailRequest.Subject}': {ex.Message}");
                        throw new Exception("Necekana chyba pri odesilani e-mailu.", ex);
                    }
                }
            }
        }
    }
}
