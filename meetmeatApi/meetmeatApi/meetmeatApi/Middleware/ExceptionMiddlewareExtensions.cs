using Microsoft.AspNetCore.Builder;
using meetmeatApi.Middleware;

namespace meetmeatApi.Middleware;

public static class ExceptionMiddlewareExtensions
{
    public static void UseCustomExceptionMiddleware(this IApplicationBuilder app)
    {
        app.UseMiddleware<ExceptionMiddleware>();
    }
}
