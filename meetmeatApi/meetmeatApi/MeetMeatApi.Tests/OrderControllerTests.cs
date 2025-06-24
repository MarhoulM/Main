using meetmeatApi.Controllers;
using meetmeatApi.Dtos;
using meetmeatApi.Models;
using meetmeatApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace MeetMeatApi.Tests
{
   
    public class OrderControllerTests
    {
        private record CreateOrderSuccessResponse(string Message, int OrderId);
        private record ErrorResponse(string Message);
        private Mock<ILogger<OrderController>> SetupMockLogger()
        {
            var mockLogger = new Mock<ILogger<OrderController>>();

            mockLogger.Setup(x => x.Log(
                It.IsAny<LogLevel>(),
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                (Func<It.IsAnyType, Exception?, string>)It.IsAny<object>()
            ));
            return mockLogger;
        }

        private OrderController SetupControllerWithClaims(IOrderService orderService, ILogger<OrderController> logger, ClaimsPrincipal user)
        {
            var controller = new OrderController(orderService, logger)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = user
                    }
                }
            };
            return controller;
        }
        //TESTS FOR POST METHOD
        [Fact]
        public async Task CreateOrrder_ValidRequest_AnonymousUser_ReturnOk()
        {
            //ARRANGE
            var mockOrderService = new Mock<IOrderService>();
            var expectedOrderId = 1;
            var expectedTotalAmount = 123.45m;

            mockOrderService.Setup(s => s.CreateOrderAsync(
                It.IsAny<CreateOrderRequestDto>(), 
                null)) 
            .ReturnsAsync(new Order 
            {
                Id = 1,
                TotalAmount = 123.45m,
                OrderDate = DateTime.UtcNow,
                Status = "Created",
                UserId = null 
            });
            var mockLogger = SetupMockLogger();

            var anonymousUser = new ClaimsPrincipal(new ClaimsIdentity()); 

            var controller = SetupControllerWithClaims(mockOrderService.Object, mockLogger.Object, anonymousUser);

            var requestDto = new CreateOrderRequestDto
            {
                FirstName = "John", 
                LastName = "Doe",   
                Email = "john.doe@example.com", 
                Address = "Main St 123", 
                City = "Prague",   
                ZipCode = "10000",  
                Phone = "+420123456789", 
                DeliveryMethod = "Standard", 
                PaymentMethod = "Card",
                Items = new List<CreateOrderItemDto>
            {
                new CreateOrderItemDto { ProductId = 1, Quantity = 1},
                new CreateOrderItemDto { ProductId = 2, Quantity = 2}
            },
                Note = "Test order note"
            };

            //ACT
            var result = await controller.CreateOrder(requestDto);

            //ASSERT
            Assert.IsType<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.NotNull(okResult);


            var jsonString = JsonSerializer.Serialize(okResult.Value);
            var returnedValue = JsonSerializer.Deserialize<CreateOrderSuccessResponse>(jsonString);
            Assert.NotNull(returnedValue);

            Assert.Equal("Objednávka byla úspěšně vytvořena!", returnedValue.Message);
            Assert.Equal(expectedOrderId, returnedValue.OrderId);

            mockOrderService.Verify(s => s.CreateOrderAsync(
                It.Is<CreateOrderRequestDto>(r =>
                    r.FirstName == requestDto.FirstName &&
                    r.Email == requestDto.Email &&
                    r.Items.Count == requestDto.Items.Count),
                null),
                Times.Once);

            mockLogger.Verify(x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((o, t) => o.ToString().Contains("Order initiated by anonymous user.")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception, string>>()),
                Times.Once);

            mockLogger.Verify(x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((o, t) => o.ToString().Contains($"New Order ID: {expectedOrderId} created successfully. Total: {expectedTotalAmount} CZK. User ID: Anonymous.")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception, string>>()),
                Times.Once);
        }

        [Fact]
        public async Task CreateOrrder_ValidRequest_AuthenticadedUser_ReturnOk()
        {
            //ARRANGE
            var mockOrderService = new Mock<IOrderService>();
            var expectedOrderId = 2;
            var expectedTotalAmount = 250.45m;
            var authenticatedUserId = 123;

            mockOrderService.Setup(s => s.CreateOrderAsync(
                It.IsAny<CreateOrderRequestDto>(),
                authenticatedUserId))
            .ReturnsAsync(new Order
            {
                Id = expectedOrderId,
                TotalAmount = expectedTotalAmount,
                OrderDate = DateTime.UtcNow,
                Status = "Created",
                UserId = authenticatedUserId
            });
            var mockLogger = SetupMockLogger();

            var userClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, authenticatedUserId.ToString()),
                new Claim(ClaimTypes.Name, "Authenticated User"), 
                new Claim(ClaimTypes.Email, "authenticated@example.com")
            };
            var userIdentity = new ClaimsIdentity(userClaims, "TestAuth");
            var authenticatedUser = new ClaimsPrincipal(userIdentity);

            var controller = SetupControllerWithClaims(mockOrderService.Object, mockLogger.Object, authenticatedUser);

            var requestDto = new CreateOrderRequestDto
            {
                FirstName = "Alice",
                LastName = "Smith",
                Email = "alice.smith@example.com",
                Address = "Authenticated Avenue 456",
                City = "London",
                ZipCode = "SW1A 0AA",
                Phone = "+447700900123",
                DeliveryMethod = "Express",
                PaymentMethod = "CreditCard",
                Items = new List<CreateOrderItemDto>
            {
                new CreateOrderItemDto { ProductId = 3, Quantity = 1 },
                new CreateOrderItemDto { ProductId = 4, Quantity = 2 }
            },
                Note = "Authenticated order note"
            };

            //ACT
            var result = await controller.CreateOrder(requestDto);

            //ASSERT
            Assert.IsType<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.NotNull(okResult);


            var jsonString = JsonSerializer.Serialize(okResult.Value);
            var returnedValue = JsonSerializer.Deserialize<CreateOrderSuccessResponse>(jsonString);
            Assert.NotNull(returnedValue);

            Assert.Equal("Objednávka byla úspěšně vytvořena!", returnedValue.Message);
            Assert.Equal(expectedOrderId, returnedValue.OrderId);

            mockOrderService.Verify(s => s.CreateOrderAsync(
                It.Is<CreateOrderRequestDto>(r =>
                    r.FirstName == requestDto.FirstName &&
                    r.Email == requestDto.Email &&
                    r.Items.Count == requestDto.Items.Count),
                authenticatedUserId),
                Times.Once);

            mockLogger.Verify(x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((o, t) => o.ToString().Contains($"Order initiated by authenticated user ID: {authenticatedUserId}.")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception, string>>()),
                Times.Once);

            mockLogger.Verify(x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((o, t) => o.ToString().Contains($"New Order ID: {expectedOrderId} created successfully. Total: {expectedTotalAmount} CZK. User ID: {authenticatedUserId}.")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception, string>>()),
                Times.Once);
        }
        //TESTS FOR GET METHOD - MY ORDERS
        [Fact]
        public async Task GetMyOrders_AutenticadedUser_ReturnOrders()
        {
            var mockOrderService = new Mock<IOrderService>();
            var authenticatedUserId = 10;

            var expectedOrders = new List<OrderResponseDto>
            {
                new OrderResponseDto
                {
                    Id = 101, OrderDate = DateTime.Now.AddDays(-5), TotalAmount = 500.00m, Status = "Completed",
                    Items = new List<OrderItemResponseDto> { new OrderItemResponseDto { ProductName = "Product1", Quantity = 1 } }
                },
                new OrderResponseDto
                {
                    Id = 102, OrderDate = DateTime.Now.AddDays(-2), TotalAmount = 250.00m, Status = "Processing",
                    Items = new List<OrderItemResponseDto> { new OrderItemResponseDto { ProductName = "Product2", Quantity = 1 } }
                }
            };

            mockOrderService.Setup(s => s.GetUserOrdersAsync(authenticatedUserId))
                .ReturnsAsync(expectedOrders);

            var mockLogger = SetupMockLogger();

            var userClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, authenticatedUserId.ToString()),
                new Claim(ClaimTypes.Name, "TestUser"),
                new Claim(ClaimTypes.Email, "test@example.com")
            };
            var userIdentity = new ClaimsIdentity(userClaims, "TestAuth");
            var authenticatedUser = new ClaimsPrincipal(userIdentity);

            var controller = SetupControllerWithClaims(mockOrderService.Object, mockLogger.Object, authenticatedUser);

            //ACT
            var result = await controller.GetMyOrders();

            //ASSERT

            Assert.IsType<OkObjectResult>(result.Result);

            var okResult = result.Result as OkObjectResult;
            Assert.NotNull(okResult);

            Assert.IsAssignableFrom<IEnumerable<OrderResponseDto>>(okResult.Value);
            var returnedOrders = okResult.Value as IEnumerable<OrderResponseDto>;
            Assert.NotNull(returnedOrders);

            Assert.Equal(expectedOrders.Count, returnedOrders.Count());

            mockOrderService.Verify(s => s.GetUserOrdersAsync(authenticatedUserId), Times.Once);

            mockLogger.Verify(x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((o, t) => o.ToString().Contains($"Order initiated by authenticated user ID: {authenticatedUserId}.")), 
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception, string>>()),
                Times.Never); 

            mockLogger.Verify(x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception, string>>()),
                Times.Never);
        }

        [Fact]
        public async Task GetMyOrders_UnauthenticadedUser_ReturnUnauthorized()
        {
            //ARRANGE
            var mockOrderService = new Mock<IOrderService>();

            var mockLogger = SetupMockLogger();

            var unauthenticatedUser = new ClaimsPrincipal(new ClaimsIdentity());
            var controller = SetupControllerWithClaims(mockOrderService.Object, mockLogger.Object, unauthenticatedUser);
            
            //ACT
            var result = await controller.GetMyOrders();

            //ASSERT
            Assert.IsType<UnauthorizedObjectResult>(result.Result);

            var unauthorizedResult = result.Result as UnauthorizedObjectResult;
            Assert.NotNull(unauthorizedResult);

            Assert.Contains("Nejste přihlášeni nebo chybí ID uživatele.", unauthorizedResult.Value.ToString());

            mockOrderService.Verify(s => s.GetUserOrdersAsync(It.IsAny<int>()), Times.Never);


            mockLogger.Verify(x => x.Log(
                LogLevel.Warning,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((o, t) => o.ToString().Contains("Attempt to access GetMyOrders without a valid UserId claim.")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception, string>>()),
                Times.Once);

            mockLogger.Verify(x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception, string>>()),
                Times.Never);
        }

        [Fact]
        public async Task GetMyOrders_ServiceThrowsException_ReturnsInternalServerError()
        {
            //ARRANGE

            var mockOrderService = new Mock<IOrderService>();
            var authenticatedUserId = 20;
            var errorMessage = "Simulovaná chyba při načítání objednávek.";

            mockOrderService.Setup(s => s.GetUserOrdersAsync(authenticatedUserId))
                .ThrowsAsync(new Exception(errorMessage)); 

            var mockLogger = SetupMockLogger();

            var userClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, authenticatedUserId.ToString()),
                new Claim(ClaimTypes.Name, "ErrorUser")
            };
            var userIdentity = new ClaimsIdentity(userClaims, "TestAuth");
            var authenticatedUser = new ClaimsPrincipal(userIdentity);

            var controller = SetupControllerWithClaims(mockOrderService.Object, mockLogger.Object, authenticatedUser);

            //ACT

            var result = await controller.GetMyOrders();

            //ASSERT
            Assert.IsType<ObjectResult>(result.Result);

            var statusCodeResult = result.Result as ObjectResult;
            Assert.NotNull(statusCodeResult);
            Assert.Equal(500, statusCodeResult.StatusCode);

            var jsonString = JsonSerializer.Serialize(statusCodeResult.Value);
            var returnedErrorValue = JsonSerializer.Deserialize<ErrorResponse>(jsonString);
            Assert.NotNull(returnedErrorValue);

            Assert.Contains("Nepodařilo se načíst objednávky.", returnedErrorValue.Message);

            mockOrderService.Verify(s => s.GetUserOrdersAsync(authenticatedUserId), Times.Once);

            mockLogger.Verify(x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((o, t) => o.ToString().Contains($"Error retrieving orders for user ID: {authenticatedUserId}.")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception, string>>()),
                Times.Once);

            mockLogger.Verify(x => x.Log(
                LogLevel.Warning,
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception, string>>()),
                Times.Never);
        }
        //TESTS FOR GET METHOD - ID

        [Fact]
        public async Task GetOrder_ExistingOrderForUser_ReturnsOrder()
        {
            //ARRANGE
            var mockOrderService = new Mock<IOrderService>();
            var authenticatedUserId = 30;
            var orderId = 301;

            var expectedOrder = new OrderResponseDto
            {
                Id = orderId,
                OrderDate = DateTime.Now.AddDays(-10),
                TotalAmount = 750.00m,
                Status = "Shipped",
                Items = new List<OrderItemResponseDto> {
                new OrderItemResponseDto { ProductName = "ProductX", Quantity = 2 },
                new OrderItemResponseDto { ProductName = "ProductY", Quantity = 1 }
            }
            };

            mockOrderService.Setup(s => s.GetOrderByIdAsync(orderId, authenticatedUserId))
                .ReturnsAsync(expectedOrder);

            var mockLogger = SetupMockLogger();

            var userClaims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, authenticatedUserId.ToString()),
            new Claim(ClaimTypes.Name, "GetOrderTestUser")
        };
            var userIdentity = new ClaimsIdentity(userClaims, "TestAuth");
            var authenticatedUser = new ClaimsPrincipal(userIdentity);

            var controller = SetupControllerWithClaims(mockOrderService.Object, mockLogger.Object, authenticatedUser);


            //ACT 

            var result = await controller.GetOrder(orderId);


            //ASSERT

            Assert.IsType<OkObjectResult>(result.Result);

            var okResult = result.Result as OkObjectResult;
            Assert.NotNull(okResult);

            Assert.IsType<OrderResponseDto>(okResult.Value);
            var returnedOrder = okResult.Value as OrderResponseDto;
            Assert.NotNull(returnedOrder);

            Assert.Equal(expectedOrder.Id, returnedOrder.Id);
            Assert.Equal(expectedOrder.TotalAmount, returnedOrder.TotalAmount);
            Assert.Equal(expectedOrder.Status, returnedOrder.Status);
            Assert.Equal(expectedOrder.Items.Count, returnedOrder.Items.Count);

            mockOrderService.Verify(s => s.GetOrderByIdAsync(orderId, authenticatedUserId), Times.Once);

            mockLogger.Verify(x => x.Log(
                LogLevel.Warning, It.IsAny<EventId>(), It.IsAny<It.IsAnyType>(), It.IsAny<Exception>(), It.IsAny<Func<It.IsAnyType, Exception, string>>()), Times.Never);
            mockLogger.Verify(x => x.Log(
                LogLevel.Error, It.IsAny<EventId>(), It.IsAny<It.IsAnyType>(), It.IsAny<Exception>(), It.IsAny<Func<It.IsAnyType, Exception, string>>()), Times.Never);
        }

        [Fact]
        public async Task GetOrder_NonExistingOrder_ReturnsNotFound()
        {
            //ARRANGE
            var mockOrderService = new Mock<IOrderService>();
            var authenticatedUserId = 31;
            var nonExistingOrderId = 999;

            mockOrderService.Setup(s => s.GetOrderByIdAsync(nonExistingOrderId, authenticatedUserId))
                .ReturnsAsync((OrderResponseDto)null);

            var mockLogger = SetupMockLogger();

            var userClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, authenticatedUserId.ToString())
            };
            var userIdentity = new ClaimsIdentity(userClaims, "TestAuth");
            var authenticatedUser = new ClaimsPrincipal(userIdentity);

            var controller = SetupControllerWithClaims(mockOrderService.Object, mockLogger.Object, authenticatedUser);


            //ACT
            var result = await controller.GetOrder(nonExistingOrderId);


            //ASSERT
            Assert.IsType<NotFoundObjectResult>(result.Result);

            var notFoundResult = result.Result as NotFoundObjectResult;
            Assert.NotNull(notFoundResult);
            Assert.Contains($"Objednávka s ID {nonExistingOrderId} nebyla nalezena nebo k ní nemáte přístup.", notFoundResult.Value.ToString());

            mockOrderService.Verify(s => s.GetOrderByIdAsync(nonExistingOrderId, authenticatedUserId), Times.Once);

            mockLogger.Verify(x => x.Log(
                LogLevel.Warning, It.IsAny<EventId>(), It.IsAny<It.IsAnyType>(), It.IsAny<Exception>(), It.IsAny<Func<It.IsAnyType, Exception, string>>()), Times.Never);
            mockLogger.Verify(x => x.Log(
                LogLevel.Error, It.IsAny<EventId>(), It.IsAny<It.IsAnyType>(), It.IsAny<Exception>(), It.IsAny<Func<It.IsAnyType, Exception, string>>()), Times.Never);
        }

        [Fact]
        public async Task GetOrder_UnauthenticatedUser_ReturnsUnauthorized()
        {
            //ARRANGE
            var mockOrderService = new Mock<IOrderService>();
            var mockLogger = SetupMockLogger();
            var orderId = 302;

            var unauthenticatedUser = new ClaimsPrincipal(new ClaimsIdentity());

            var controller = SetupControllerWithClaims(mockOrderService.Object, mockLogger.Object, unauthenticatedUser);


            //ACT
            var result = await controller.GetOrder(orderId);


            //ASSERT
            Assert.IsType<UnauthorizedObjectResult>(result.Result);

            var unauthorizedResult = result.Result as UnauthorizedObjectResult;
            Assert.NotNull(unauthorizedResult);
            Assert.Contains("Pro zobrazení detailu objednávky musíte být přihlášeni.", unauthorizedResult.Value.ToString());

            mockOrderService.Verify(s => s.GetOrderByIdAsync(It.IsAny<int>(), It.IsAny<int?>()), Times.Never);

            mockLogger.Verify(x => x.Log(
                LogLevel.Warning, It.IsAny<EventId>(), It.IsAny<It.IsAnyType>(), It.IsAny<Exception>(), It.IsAny<Func<It.IsAnyType, Exception, string>>()), Times.Never); 
            mockLogger.Verify(x => x.Log(
                LogLevel.Error, It.IsAny<EventId>(), It.IsAny<It.IsAnyType>(), It.IsAny<Exception>(), It.IsAny<Func<It.IsAnyType, Exception, string>>()), Times.Never);
        }

        [Fact]
        public async Task GetOrder_ServiceThrowsUnauthorizedAccessException_ReturnsUnauthorized()
        {
            //ARRANGE
            var mockOrderService = new Mock<IOrderService>();
            var authenticatedUserId = 32;
            var orderId = 303;
            var errorMessage = "Nemáte oprávnění k zobrazení této objednávky.";

            mockOrderService.Setup(s => s.GetOrderByIdAsync(orderId, authenticatedUserId))
                .ThrowsAsync(new UnauthorizedAccessException(errorMessage));

            var mockLogger = SetupMockLogger();

            var userClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, authenticatedUserId.ToString())
            };
            var userIdentity = new ClaimsIdentity(userClaims, "TestAuth");
            var authenticatedUser = new ClaimsPrincipal(userIdentity);

            var controller = SetupControllerWithClaims(mockOrderService.Object, mockLogger.Object, authenticatedUser);


            //ACT
            var result = await controller.GetOrder(orderId);


            //ASSERT 
            Assert.IsType<UnauthorizedObjectResult>(result.Result);

            var unauthorizedResult = result.Result as UnauthorizedObjectResult;
            Assert.NotNull(unauthorizedResult);
            Assert.Contains(errorMessage, unauthorizedResult.Value.ToString());

            mockOrderService.Verify(s => s.GetOrderByIdAsync(orderId, authenticatedUserId), Times.Once);

            mockLogger.Verify(x => x.Log(
                LogLevel.Warning,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((o, t) => o.ToString().Contains($"Unauthorized access attempt to order {orderId} by user {authenticatedUserId}.")),
                It.IsAny<UnauthorizedAccessException>(),
                It.IsAny<Func<It.IsAnyType, Exception, string>>()),
                Times.Once);

            mockLogger.Verify(x => x.Log(
                LogLevel.Error, It.IsAny<EventId>(), It.IsAny<It.IsAnyType>(), It.IsAny<Exception>(), It.IsAny<Func<It.IsAnyType, Exception, string>>()), Times.Never);
        }

        [Fact]
        public async Task GetOrder_ServiceThrowsGeneralException_ReturnsInternalServerError()
        {
            //ARRANGE
            var mockOrderService = new Mock<IOrderService>();
            var authenticatedUserId = 33;
            var orderId = 304;
            var errorMessage = "Neočekávaná chyba při získávání objednávky.";

            mockOrderService.Setup(s => s.GetOrderByIdAsync(orderId, authenticatedUserId))
                .ThrowsAsync(new Exception(errorMessage));

            var mockLogger = SetupMockLogger();

            var userClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, authenticatedUserId.ToString())
            };
            var userIdentity = new ClaimsIdentity(userClaims, "TestAuth");
            var authenticatedUser = new ClaimsPrincipal(userIdentity);

            var controller = SetupControllerWithClaims(mockOrderService.Object, mockLogger.Object, authenticatedUser);


            //ACT
            var result = await controller.GetOrder(orderId);


            //ASSERT
            Assert.IsType<ObjectResult>(result.Result);

            var statusCodeResult = result.Result as ObjectResult;
            Assert.NotNull(statusCodeResult);
            Assert.Equal(500, statusCodeResult.StatusCode);

            var jsonString = JsonSerializer.Serialize(statusCodeResult.Value);
            var returnedErrorValue = JsonSerializer.Deserialize<ErrorResponse>(jsonString);
            Assert.NotNull(returnedErrorValue);
            Assert.Contains("Nepodařilo se načíst detail objednávky.", returnedErrorValue.Message);

            mockOrderService.Verify(s => s.GetOrderByIdAsync(orderId, authenticatedUserId), Times.Once);

            mockLogger.Verify(x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((o, t) => o.ToString().Contains($"Error retrieving order {orderId} for user {authenticatedUserId}.")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception, string>>()),
                Times.Once);

            mockLogger.Verify(x => x.Log(
                LogLevel.Warning, It.IsAny<EventId>(), It.IsAny<It.IsAnyType>(), It.IsAny<Exception>(), It.IsAny<Func<It.IsAnyType, Exception, string>>()), Times.Never);
        }
    }
}
