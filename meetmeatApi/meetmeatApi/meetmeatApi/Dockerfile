FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src/app

COPY meetmeatApi.csproj .
RUN dotnet restore

COPY . .

RUN dotnet publish "meetmeatApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 80

ENTRYPOINT ["dotnet", "meetmeatApi.dll"]
