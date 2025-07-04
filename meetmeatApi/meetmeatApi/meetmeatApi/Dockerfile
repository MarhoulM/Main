FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["meetmeatApi/meetmeatApi.csproj", "meetmeatApi/"]
RUN dotnet restore "meetmeatApi/meetmeatApi.csproj"

COPY . /src/meetmeatApi
WORKDIR "/src/meetmeatApi"


RUN dotnet publish "meetmeatApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 80

ENTRYPOINT ["dotnet", "meetmeatApi.dll"]