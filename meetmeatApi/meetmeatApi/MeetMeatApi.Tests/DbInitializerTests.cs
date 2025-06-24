using meetmeatApi.Controllers;
using meetmeatApi.Data;
using meetmeatApi.Dtos;
using meetmeatApi.Models;
using meetmeatApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace MeetMeatApi.Tests
{
    public class DbInitializerTests
    {
        private Mock<ILogger<Program>> SetupMockLogger(List<(LogLevel Level, string Message)> capturedLogMessages)
        {
            var mockLogger = new Mock<ILogger<Program>>();

            mockLogger.Setup(x => x.Log(It.IsAny<LogLevel>(),
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
            return mockLogger;
        }

        [Fact]
        public async Task Initialize_EmptyDatabase_SeedsProductAndLogsSuccess()
        {
            //ARRANGE
            var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()).Options;

            using var context = new ApplicationDbContext(options);
            await context.Database.EnsureCreatedAsync();

            var capturedLogMessages = new List<(LogLevel Level, string Message)> ();
            var mockLogger = SetupMockLogger(capturedLogMessages);

            //ACT
            await DbInitializer.Initialize(context, mockLogger.Object);

            //ASSERT
            Assert.Equal(10, await context.Products.CountAsync());

            Assert.Contains(capturedLogMessages, m => m.Level == LogLevel.Information && m.Message.Contains("DbInitializer: Seeding products..."));

            Assert.Contains(capturedLogMessages, m => m.Level == LogLevel.Information && m.Message.Contains("DbInitializer: Products seeded successfully."));

            mockLogger.Verify(l => l.Log(It.IsAny<LogLevel>(), 
            It.IsAny<EventId>(),
            It.IsAny<It.IsAnyType>(),
            It.IsAny<Exception?>(),
            (Func<It.IsAnyType, Exception?, string>)It.IsAny<object>()),
            Times.Exactly(3));
        }
        [Fact]
        public async Task Initialize_DatabaseContainsProducts_SkipSeedingAndLogMessage()
        {
            //ARRANGE
            var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()).Options;

            using var context = new ApplicationDbContext(options);
            await context.Database.EnsureCreatedAsync();

            context.Products.Add(new Product {
                Id = 1,
                Name = "Existující Produkt",
                Price = 100,
                Currency = "Kč",
                Category = "TestCategory",
                DetailDescription = new ProductDetailDescription
                {
                    MeatType = "Test Meat",
                    Process = "Test Process",
                    Weight = "Test Weight",
                    Nutrition = "Test Nutrition",
                    Origin = "Test Origin",
                    ShelfLife = "Test ShelfLife"
                }
            });
            await context.SaveChangesAsync();

            Assert.Equal(1, await context.Products.CountAsync());

            var capturedLogMessages = new List<(LogLevel Level, string Message)>();
            var mockLogger = SetupMockLogger(capturedLogMessages);
            
            //ACT
            await DbInitializer.Initialize(context, mockLogger.Object);

            //ASSERT
            Assert.Equal(1, await context.Products.CountAsync());

            Assert.Contains(capturedLogMessages, m =>
                m.Level == LogLevel.Information &&
                m.Message.Contains("DbInitializer: Database already contains products. Skipping seeding."));

            mockLogger.Verify(l => l.Log(
           It.IsAny<LogLevel>(),
           It.IsAny<EventId>(),
           It.IsAny<It.IsAnyType>(),
           It.IsAny<Exception?>(),
           (Func<It.IsAnyType, Exception?, string>)It.IsAny<object>()),
           Times.Exactly(2));
        }
        [Fact]
        public async Task CreateProduct_ValidProduct_ReturnCreatedAtAction()
        {
            //ARRANGE
            var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()).Options;
            using var context = new ApplicationDbContext(options);
            await context.Database.EnsureCreatedAsync();
            Assert.Equal(0, await context.Products.CountAsync());

            var controller = new ProductsController(context);

            var createDto = new ProductCreateDto
            {
                Name = "New Product",
                Price = 50.00m,
                Currency = "Kč",
                Category = "NewCategory",
                ImageUrl = "http://example.com/new.jpg",
                Description = "Description for new product.",
                DetailDescription = new ProductDetailDescriptionCreateDto
                {
                    MeatType = "NewMeat",
                    Process = "NewProcess",
                    Weight = "500g",
                    Nutrition = "NewNut",
                    Origin = "NewOrigin",
                    ShelfLife = "NewShelf"
                }
            };

            //ACT
            var result = await controller.CreateProduct(createDto);

            //ASSERT
            Assert.IsType<CreatedAtActionResult>(result.Result);

            var createdAtActionResult = result.Result as CreatedAtActionResult;
            Assert.NotNull(createdAtActionResult);

            Assert.Equal(nameof(ProductsController.GetProduct), createdAtActionResult.ActionName);

            Assert.IsType<ProductReadDto>(createdAtActionResult.Value);

            var createdProductDto = createdAtActionResult.Value as ProductReadDto;
            Assert.NotNull(createdProductDto);

            Assert.NotEqual(0, createdProductDto.Id); 
            Assert.Equal(createDto.Name, createdProductDto.Name);
            Assert.Equal(createDto.Price, createdProductDto.Price);
            Assert.Equal(createDto.Currency, createdProductDto.Currency);
            Assert.Equal(createDto.Category, createdProductDto.Category);
            Assert.Equal(createDto.ImageUrl, createdProductDto.ImageUrl);
            Assert.Equal(createDto.Description, createdProductDto.Description);

            Assert.NotNull(createdProductDto.DetailDescription);
            Assert.Equal(createDto.DetailDescription.MeatType, createdProductDto.DetailDescription.MeatType);
            Assert.Equal(createDto.DetailDescription.Process, createdProductDto.DetailDescription.Process);
            Assert.Equal(createDto.DetailDescription.Weight, createdProductDto.DetailDescription.Weight);
            Assert.Equal(createDto.DetailDescription.Nutrition, createdProductDto.DetailDescription.Nutrition);
            Assert.Equal(createDto.DetailDescription.Origin, createdProductDto.DetailDescription.Origin);
            Assert.Equal(createDto.DetailDescription.ShelfLife, createdProductDto.DetailDescription.ShelfLife);

            Assert.Equal(1, await context.Products.CountAsync()); 
            var productInDb = await context.Products.Include(p => p.DetailDescription).FirstOrDefaultAsync(p => p.Id == createdProductDto.Id);
            Assert.NotNull(productInDb); 


            Assert.Equal(createDto.Name, productInDb.Name);
            Assert.Equal(createDto.Price, productInDb.Price);
            Assert.Equal(createDto.DetailDescription.MeatType, productInDb.DetailDescription.MeatType);
        }

        [Fact]
        public async Task CreateProduct_InvalidProduct_ReturnsBadRequest()
        {
            //ARRANGE

            var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()).Options;

            using var context = new ApplicationDbContext(options);
            await context.Database.EnsureCreatedAsync();

            Assert.Equal(0, await context.Products.CountAsync());

            var controller = new ProductsController(context);

            var createDto = new ProductCreateDto
            {
                Name = "",
                Price = 50.00m,
                Currency = "Kč",
                Category = "InvalidCategory",
                ImageUrl = "http://example.com/invalid.jpg",
                Description = "Description for invalid product.",
                DetailDescription = new ProductDetailDescriptionCreateDto
                {
                    MeatType = "InvalidMeat",
                    Process = "InvalidProcess",
                    Weight = "100g",
                    Nutrition = "InvalidNut",
                    Origin = "InvalidOrigin",
                    ShelfLife = "InvalidShelf"
                }
            };

            controller.ModelState.AddModelError("Name", "The Name field is required.");
            var result = await controller.CreateProduct(createDto);


            //ASSERT

            Assert.IsType<BadRequestObjectResult>(result.Result);

            var badRequestResult = result.Result as BadRequestObjectResult;
            Assert.NotNull(badRequestResult);

            Assert.IsType<SerializableError>(badRequestResult.Value);
            var errors = badRequestResult.Value as SerializableError;
            Assert.NotNull(errors);

            Assert.True(errors.ContainsKey("Name"));
            Assert.Contains("The Name field is required.", (string[])errors["Name"]);

            Assert.Equal(0, await context.Products.CountAsync());

        }
    }
}
