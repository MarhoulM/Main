using Microsoft.AspNetCore.Http;
using System.Net;
using System.Threading.Tasks;
using meetmeatApi.Models;

namespace meetmeatApi.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _logger = logger;
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {

                _logger.LogError($"Something went wrong: {ex}");

                httpContext.Response.ContentType = "application/json";
                httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                await httpContext.Response.WriteAsync(new ErrorDetails()
                {
                    StatusCode = httpContext.Response.StatusCode,
                    Message = "Internal Server Error from the custom middleware. " +
                              "Please contact support if the issue persists."
                }.ToString());


            }
        }
    }
}
