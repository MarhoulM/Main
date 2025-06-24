using Xunit;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using meetmeatApi.Data;
using meetmeatApi.Dtos;
using meetmeatApi.Models;
using meetmeatApi.Services;
using System; 
using Moq.Language.Flow; 


namespace MeetMeatApi.Tests;

public class OrderServiceTests
{


    [Fact]
    public async Task CreateOrderAsync_ValidRequest_CreatesOrderAndSendsEmail()
    {
        // ARRANGE
        var mockLogger = new Mock<ILogger<OrderService>>();
        var capturedLogMessages = new List<(LogLevel Level, string Message)>();

 
        mockLogger.Setup(x => x.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(), 
                It.IsAny<Exception?>(),
                (Func<It.IsAnyType, Exception?, string>)It.IsAny<object>())) 
            .Callback(new InvocationAction(invocation =>
            {
                var logLevel = (LogLevel)invocation.Arguments[0];
                var state = invocation.Arguments[2];
                var exception = invocation.Arguments[3] as Exception;


                var message = state.ToString(); 
                capturedLogMessages.Add((logLevel, message));
            }));

        var mockEmailService = new Mock<IEmailService>();


        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        using var context = new ApplicationDbContext(options);
        await context.Database.EnsureCreatedAsync();

        // Seedujeme data pro test
        context.Products.AddRange(
            new Product
            {
                Id = 1,
                Name = "Hovězí Jerky Klasik",
                Price = 250m,
                Currency = "Kč",
                Category = "Jerky",
                DetailDescription = new ProductDetailDescription { MeatType = "Hovězí", Process = "Sušení", Weight = "50g" }
            },
            new Product
            {
                Id = 2,
                Name = "Vepřové Jerky Pikantní",
                Price = 280m,
                Currency = "Kč",
                Category = "Jerky",
                DetailDescription = new ProductDetailDescription { MeatType = "Vepřové", Process = "Sušení", Weight = "50g" }
            }
        );
        await context.SaveChangesAsync(); 

        var orderService = new OrderService(context, mockLogger.Object, mockEmailService.Object);

        var requestDto = new CreateOrderRequestDto
        {
            FirstName = "Jan",
            LastName = "Novák",
            Email = "jan.novak@example.com",
            Address = "Ulice 123",
            City = "Město",
            ZipCode = "12345",
            Phone = "123456789",
            DeliveryMethod = "Standard",
            PaymentMethod = "Card",
            Note = "Žádná poznámka.",
            Items = new List<CreateOrderItemDto>
            {
                new CreateOrderItemDto { ProductId = 1, Quantity = 2 },
                new CreateOrderItemDto { ProductId = 2, Quantity = 1 }
            }
        };

        // ACT
        var resultOrder = await orderService.CreateOrderAsync(requestDto, 1);


        // ASSERT
        Assert.NotNull(resultOrder);
        // Ověříme, že objednávka byla skutečně přidána do in-memory databáze
        var addedOrderInDb = await context.Orders.Include(o => o.OrderItems).FirstOrDefaultAsync(o => o.Id == resultOrder.Id);
        Assert.NotNull(addedOrderInDb);
        Assert.Equal(requestDto.FirstName, addedOrderInDb.FirstName);
        Assert.Equal(requestDto.Email, addedOrderInDb.Email);
        Assert.Equal(requestDto.Items.Count, addedOrderInDb.OrderItems.Count);
        Assert.Equal(250m * 2 + 280m * 1, addedOrderInDb.TotalAmount);
        Assert.Equal("Pending", addedOrderInDb.Status);
        Assert.NotEqual(default(DateTime), addedOrderInDb.OrderDate);

        Assert.Contains(capturedLogMessages, m =>
            m.Level == LogLevel.Information &&
            m.Message.Contains($"Nova objednavka ID: {addedOrderInDb.Id}")
        );
        mockLogger.Verify(l => l.Log(
            It.IsAny<LogLevel>(),
            It.IsAny<EventId>(),
            It.IsAny<It.IsAnyType>(),
            It.IsAny<Exception?>(),
            (Func<It.IsAnyType, Exception?, string>)It.IsAny<object>()),
            Times.Exactly(2));


        mockEmailService.Verify(
            e => e.SendEmailAsync(It.Is<EmailRequestDto>(dto =>
                dto.To == requestDto.Email &&
                dto.Subject.Contains($"Potvrzení objednávky #{addedOrderInDb.Id}") &&
                dto.Body.Contains(requestDto.FirstName)
            )),
            Times.Once
        );
    }

    [Fact]
    public async Task CreateOrderAsync_ThrowsException_WhenProductNotFound()
    {
        // ARRANGE
        var mockLogger = new Mock<ILogger<OrderService>>();
        var capturedLogMessages = new List<(LogLevel Level, string Message)>();
        mockLogger.Setup(x => x.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                (Func<It.IsAnyType, Exception?, string>)It.IsAny<object>()))
            .Callback(new InvocationAction(invocation =>
            {
                var logLevel = (LogLevel)invocation.Arguments[0];
                var state = invocation.Arguments[2];
                var exception = invocation.Arguments[3] as Exception;

                var message = state.ToString();
                capturedLogMessages.Add((logLevel, message));
            }));

        var mockEmailService = new Mock<IEmailService>();

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        using var context = new ApplicationDbContext(options);
        await context.Database.EnsureCreatedAsync();

        context.Products.Add(
            new Product
            {
                Id = 1,
                Name = "Product A",
                Price = 100m,
                Currency = "Kč",
                Category = "Test",
                DetailDescription = new ProductDetailDescription { MeatType = "Testovací maso", Process = "Testovací proces" }
            }
        );
        await context.SaveChangesAsync();

        var orderService = new OrderService(context, mockLogger.Object, mockEmailService.Object);

        var requestDto = new CreateOrderRequestDto
        {
            FirstName = "Test",
            Email = "test@example.com",
            Items = new List<CreateOrderItemDto>
            {
                new CreateOrderItemDto { ProductId = 1, Quantity = 1 },
                new CreateOrderItemDto { ProductId = 999, Quantity = 1 }
            }
        };

        // ACT & ASSERT
        var exception = await Assert.ThrowsAsync<ArgumentException>(() =>
            orderService.CreateOrderAsync(requestDto));

        Assert.Contains("Některé produkty v objednávce nebyly nalezeny: 999.", exception.Message);

        Assert.Equal(0, await context.Orders.CountAsync());

        mockEmailService.Verify(e => e.SendEmailAsync(It.IsAny<EmailRequestDto>()), Times.Never);

        Assert.Contains(capturedLogMessages, m =>
            m.Level == LogLevel.Warning &&
            m.Message.Contains("Objednavka obsahuje neexistujici produkty.")
        );
        mockLogger.Verify(l => l.Log(
            It.IsAny<LogLevel>(),
            It.IsAny<EventId>(),
            It.IsAny<It.IsAnyType>(),
            It.IsAny<Exception?>(),
            (Func<It.IsAnyType, Exception?, string>)It.IsAny<object>()),
            Times.Once);
    }

    [Fact]
    public async Task CreateOrderAsync_ThrowsException_WhenQuantityIsInvalid()
    {
        // ARRANGE
        var mockLogger = new Mock<ILogger<OrderService>>();
        var capturedLogMessages = new List<(LogLevel Level, string Message)>();
        mockLogger.Setup(x => x.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                (Func<It.IsAnyType, Exception?, string>)It.IsAny<object>()))
            .Callback(new InvocationAction(invocation =>
            {
                var logLevel = (LogLevel)invocation.Arguments[0];
                var state = invocation.Arguments[2];
                var exception = invocation.Arguments[3] as Exception;

                var message = state.ToString();
                capturedLogMessages.Add((logLevel, message));
            }));

        var mockEmailService = new Mock<IEmailService>();

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        using var context = new ApplicationDbContext(options);
        await context.Database.EnsureCreatedAsync();

        context.Products.Add(
            new Product
            {
                Id = 1,
                Name = "Product A",
                Price = 100m,
                Currency = "Kč",
                Category = "Test",
                DetailDescription = new ProductDetailDescription { MeatType = "Testovací maso", Process = "Testovací proces" }
            }
        );
        await context.SaveChangesAsync();

        var orderService = new OrderService(context, mockLogger.Object, mockEmailService.Object);

        var requestDto = new CreateOrderRequestDto
        {
            FirstName = "Test",
            Email = "test@example.com",
            Items = new List<CreateOrderItemDto>
            {
                new CreateOrderItemDto { ProductId = 1, Quantity = 0 } 
            }
        };

        // ACT & ASSERT
        var exception = await Assert.ThrowsAsync<ArgumentException>(() =>
            orderService.CreateOrderAsync(requestDto));

        Assert.Contains("Neplatné množství pro produkt s ID: 1. Množství musí být kladné číslo.", exception.Message);

        Assert.Equal(0, await context.Orders.CountAsync());

        mockEmailService.Verify(e => e.SendEmailAsync(It.IsAny<EmailRequestDto>()), Times.Never);

        Assert.Contains(capturedLogMessages, m =>
            m.Level == LogLevel.Warning &&
            m.Message.Contains("Invalid quantity")
        );
        mockLogger.Verify(l => l.Log(
            It.IsAny<LogLevel>(),
            It.IsAny<EventId>(),
            It.IsAny<It.IsAnyType>(),
            It.IsAny<Exception?>(),
            (Func<It.IsAnyType, Exception?, string>)It.IsAny<object>()),
            Times.Once); 
    }
}
