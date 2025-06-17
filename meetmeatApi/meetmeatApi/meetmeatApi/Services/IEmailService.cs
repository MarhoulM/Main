using System.Threading.Tasks;
using meetmeatApi.Dtos;

namespace meetmeatApi.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(EmailRequestDto emailRequest);
    }
}
