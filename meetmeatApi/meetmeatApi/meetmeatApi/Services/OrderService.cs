using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using meetmeatApi.Data; 
using meetmeatApi.Dtos; 
using meetmeatApi.Models; 
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace meetmeatApi.Services
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<OrderService> _logger;
        private readonly IEmailService _emailService;

        public OrderService(ApplicationDbContext context, ILogger<OrderService> logger, IEmailService emailService)
        {
            _context = context;
            _logger = logger;
            _emailService = emailService;
        }
        public async Task<Order> CreateOrderAsync(CreateOrderRequestDto request, int? userId = null)
        {
            var productIds = request.Items.Select(item => item.ProductId).ToList();
            var products = await _context.Products
                                         .Where(p => productIds.Contains(p.Id))
                                         .ToDictionaryAsync(p => p.Id);

            if (productIds.Count != products.Count)
            {
                var missingProductIds = productIds.Except(products.Keys).ToList();
                _logger.LogWarning($"Objednavka obsahuje neexistujici produkty. Chybejici ID: {string.Join(", ", missingProductIds)}");
                throw new ArgumentException($"Některé produkty v objednávce nebyly nalezeny: {string.Join(", ", missingProductIds)}.");
            }

            var orderItems = new List<OrderItem>();
            decimal totalAmount = 0;

            foreach (var itemDto in request.Items)
            {
                var product = products[itemDto.ProductId];

                if (itemDto.Quantity <= 0)
                {
                    _logger.LogWarning($"Invalid quantity ({itemDto.Quantity}) for ProductId {itemDto.ProductId} in order request.");
                    throw new ArgumentException($"Neplatné množství pro produkt s ID: {itemDto.ProductId}. Množství musí být kladné číslo.");
                }

                var orderItem = new OrderItem
                {
                    ProductId = itemDto.ProductId,
                    Quantity = itemDto.Quantity,
                    PriceAtOrder = product.Price
                };
                orderItems.Add(orderItem);
                totalAmount += orderItem.Quantity * orderItem.PriceAtOrder;
            }

            var order = new Order
            {
                OrderDate = DateTime.UtcNow,  
                TotalAmount = totalAmount,     
                UserId = userId,               
                OrderItems = orderItems,    

                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Address = request.Address,
                City = request.City,
                ZipCode = request.ZipCode,
                Phone = request.Phone,
                DeliveryMethod = request.DeliveryMethod,
                PaymentMethod = request.PaymentMethod,
                Note = request.Note
            };


            _context.Orders.Add(order);
            await _context.SaveChangesAsync(); 

            _logger.LogInformation($"Nova objednavka ID: {order.Id} vytvořena. Celkem: {order.TotalAmount} CZK. Uživatelské ID: {userId?.ToString() ?? "Anonymní"}.");

            try
            {
                var emailSubject = $"Potvrzení objednávky #{order.Id} - MeetMeat";
                var emailBody = BuildOrderConfirmationEmailBody(order, products);

                var emailRequest = new EmailRequestDto
                {
                    To = order.Email,
                    Subject = emailSubject,
                    Body = emailBody
                };

                await _emailService.SendEmailAsync(emailRequest);
                _logger.LogInformation($"Potvrzovaci email objednavky ID: {order.Id} uspesne odeslan na {order.Email}.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Chyba pri odesilani potvrzovaciho emailu pro objednavku ID: {order.Id} na {order.Email}.");
            }

            return order; 
        }

        private string BuildOrderConfirmationEmailBody(Order order, Dictionary<int, Product> products)
        {
            var itemsHtml = "";
            foreach (var item in order.OrderItems)
            {

                var productName = products.ContainsKey(item.ProductId) ? products[item.ProductId].Name : "Neznámý produkt";
                itemsHtml += $@"
                    <tr>
                        <td style='padding: 8px; border: 1px solid #ddd;'>{productName}</td>
                        <td style='padding: 8px; border: 1px solid #ddd;'>{item.Quantity}</td>
                        <td style='padding: 8px; border: 1px solid #ddd;'>{item.PriceAtOrder:F2} Kč</td>
                        <td style='padding: 8px; border: 1px solid #ddd;'>{(item.Quantity * item.PriceAtOrder):F2} Kč</td>
                    </tr>";
            }

            var noteHtml = (order.Note != null && order.Note != "") ? $"<p><strong>Poznámka:</strong> {order.Note}</p>" : "";

            return $@"
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9; }}
                    h2 {{ color: #A80B0B; }}
                    table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
                    th, td {{ padding: 10px; border: 1px solid #ddd; text-align: left; }}
                    th {{ background-color: #f2f2f2; }}
                    .total {{ font-weight: bold; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <h2>Potvrzení objednávky #{order.Id}</h2>
                    <p>Dobrý den, {order.FirstName} {order.LastName},</p>
                    <p>Děkujeme za vaši objednávku! Byla úspěšně přijata a brzy ji začneme zpracovávat.</p>
                    <p>Číslo vaší objednávky je: <strong>#{order.Id}</strong></p>
                    
                    <h3>Detaily objednávky:</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Produkt</th>
                                <th>Množství</th>
                                <th>Cena/kus</th>
                                <th>Celkem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemsHtml}
                            <tr>
                                <td colspan='3' class='total' style='text-align: right; font-weight: bold;'>Celková částka:</td>
                                <td class='total' style='font-weight: bold;'>{order.TotalAmount:F2} Kč</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Doručovací údaje:</h3>
                    <p><strong>Jméno:</strong> {order.FirstName} {order.LastName}</p>
                    <p><strong>E-mail:</strong> {order.Email}</p>
                    <p><strong>Adresa:</strong> {order.Address}, {order.ZipCode} {order.City}</p>
                    <p><strong>Telefon:</strong> {order.Phone}</p>
                    <p><strong>Způsob doručení:</strong> {order.DeliveryMethod}</p>
                    <p><strong>Způsob platby:</strong> {order.PaymentMethod}</p>
                    {noteHtml}

                    <p>S pozdravem,</p>
                    <p>Tým MeetMeat</p>
                </div>
            </body>
            </html>";
        }
    }
}
