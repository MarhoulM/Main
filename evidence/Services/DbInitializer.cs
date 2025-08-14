using Evidence.Data;
using Evidence.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Evidence.Services
{
    public class DbInitializer
    {
        public static async Task  Initialize(ApplicationDbContext context, ILogger<Program> logger)
        {
            if (context.Database.IsRelational())
            {
                logger.LogInformation("DbInitializer: Applying migrations to relational database...");
                await context.Database.MigrateAsync();
                logger.LogInformation("DbInitializer: Migrations applied successfully.");
            }else
            {
                logger.LogInformation("DbInitializer: Using noon-relational database (e.g., in-memory). Skipping MigrateAsync.");
            }
            logger.LogInformation("DbInitializer: Seeding products...");

            var products = new List<Product>
            {
                new Product
                {
                    
                    Name = "Vykoupení z věznice Shawshank",
                    Author = null,
                    Director = "Frank Darabont",
                    Category = "CD",
                    Genre = "Drama / Krimi",
                    Description = "USA (1994). Hrají: Tim Robbins, Morgan Freeman. Hodnocení: 95,4% ",
                    DateOfAcquisition = new DateTime(2025, 8, 13),
                    Availability = true
                },
                new Product
                {
                  
                    Name = "Forrest Gump",
                    Author = null,
                    Director = "Robert Zemeckis",
                    Category = "DVD",
                    Genre = "Drama / Komedie",
                    Description = "USA (1994). Hrají: Tom Hanks, Robin Wright. Hodnocení: 94,4% ",
                    DateOfAcquisition = new DateTime(2025, 8, 13),
                    Availability = true
                },
                new Product
                {
                    
                    Name = "Zelená míle",
                    Author = null,
                    Director = "Frank Darabont",
                    Category = "CD",
                    Genre = "Drama / Mysteriózní",
                    Description = "USA (1999). Hrají: Tom Hanks, David Morse. Hodnocení: 92,9% ",
                    DateOfAcquisition = new DateTime(2025, 8, 13),
                    Availability = true
                },
                new Product
                {
                  
                    Name = "Sedm",
                    Author = null,
                    Director = "David Fincher",
                    Category = "DVD",
                    Genre = "Thriller / Krimi",
                    Description = "USA (1995). Hrají: Brad Pitt, Morgan Freeman. Hodnocení: 92,5% ",
                    DateOfAcquisition = new DateTime(2025, 8, 13),
                    Availability = true
                },
                new Product
                {
                   
                    Name = "Přelet nad kukaččím hnízdem",
                    Author = null,
                    Director = "Miloš Forman",
                    Category = "CD",
                    Genre = "Drama",
                    Description = "USA (1975). Hrají: Jack Nicholson, Louise Fletcher. Hodnocení: 92,4% ",
                    DateOfAcquisition = new DateTime(2025, 8, 13),
                    Availability = true
                },
                new Product
                {
                   
                    Name = "Schindlerův seznam",
                    Author = null,
                    Director = "Steven Spielberg",
                    Category = "DVD",
                    Genre = "Drama / Historický",
                    Description = "USA (1993). Hrají: Liam Neeson, Ben Kingsley. Hodnocení: 92,4% ",
                    DateOfAcquisition = new DateTime(2025, 8, 13),
                    Availability = true
                },
                new Product
                {
                  
                    Name = "Kmotr",
                    Author = null,
                    Director = "Francis Ford Coppola",
                    Category = "DVD",
                    Genre = "Drama / Krimi",
                    Description = "USA (1972). Hrají: Marlon Brando, Al Pacino. Hodnocení: 91,8% ",
                    DateOfAcquisition = new DateTime(2025, 8, 13),
                    Availability = true
                },
                new Product
                {
                   
                    Name = "Dvanáct rozhněvaných mužů",
                    Author = null,
                    Director = "Sidney Lumet",
                    Category = "DVD",
                    Genre = "Drama / Krimi",
                    Description = "USA (1957). Hrají: Henry Fonda, Martin Balsam. Hodnocení: 91,5% ",
                    DateOfAcquisition = new DateTime(2025, 8, 13),
                    Availability = true
                },
                new Product
                {
                  
                    Name = "Nedotknutelní",
                    Author = null,
                    Director = "Eric Toledano, Olivier Nakache",
                    Category = "DVD",
                    Genre = "Komedie / Drama",
                    Description = "Francie (2011). Hrají: François Cluzet, Omar Sy. Hodnocení: 91,3% ",
                    DateOfAcquisition = new DateTime(2025, 8, 13),
                    Availability = true
                },
                new Product
                {
                   
                    Name = "Pelíšky",
                    Author = null,
                    Director = "Jan Hřebejk",
                    Category = "DVD",
                    Genre = "Komedie / Drama",
                    Description = "Česko (1999). Hrají: Miroslav Donutil, Jiří Kodet. Hodnocení: 91,2% ",
                    DateOfAcquisition = new DateTime(2025, 8, 13),
                    Availability = true
                },
                new Product
                {
                  
                    Name = "Pán prstenů: Společenstvo prstenu",
                    Author = "J.R.R. Tolkien",
                    Director = null,
                    Category = "Kniha",
                    Genre = "Fantasy / Dobrodružný",
                    Description = "První díl epické trilogie o cestě za zničením Prstenu moci. Klasika moderní fantasy.",
                    DateOfAcquisition = new DateTime(2025, 8, 14),
                    Availability = true
                },
                new Product
                {
                    
                    Name = "Pán prstenů: Dvě věže",
                    Author = "J.R.R. Tolkien",
                    Director = null,
                    Category = "Kniha",
                    Genre = "Fantasy / Dobrodružný",
                    Description = "Druhý díl trilogie. Frodo pokračuje v cestě, zatímco ostatní bojují proti silám zla.",
                    DateOfAcquisition = new DateTime(2025, 8, 14),
                    Availability = true
                },
                new Product
                {
                   
                    Name = "Kmotr",
                    Author = "Mario Puzo",
                   Director = null,
                    Category = "Kniha",
                    Genre = "Drama / Krimi",
                    Description = "Román o moci, rodině a mafii. Puzo vytvořil ikonický portrét dona Corleona.",
                    DateOfAcquisition = new DateTime(2025, 8, 14),
                    Availability = true
                },
                new Product
                {
                    
                    Name = "To",
                    Author = "Stephen King",
                    Director = null,
                    Category = "Kniha",
                    Genre = "Horor / Thriller",
                    Description = "Děsivý příběh o zlu, které se skrývá v městě Derry. Děti se musí postavit svému největšímu strachu.",
                    DateOfAcquisition = new DateTime(2025, 8, 14),
                    Availability = true
                },
                new Product
                {
                    
                    Name = "Osvícení",
                    Author = "Stephen King",
                    Director = null,
                    Category = "Kniha",
                    Genre = "Horor / Psychologický",
                    Description = "Jack Torrance přijíždí do hotelu Overlook, kde se začínají dít děsivé věci. Klasika hororu.",
                    DateOfAcquisition = new DateTime(2025, 8, 14),
                    Availability = true
                }
            };
            foreach (var productToSeed in products)
            {
                var existingProduct = await context.Products
                    .FirstOrDefaultAsync(p =>
                        p.Name == productToSeed.Name &&
                        p.Category == productToSeed.Category &&
                        p.Author == productToSeed.Author &&
                        p.Director == productToSeed.Director);

                if (existingProduct == null)
                {
                    context.Products.Add(productToSeed);
                    logger.LogInformation($"DbInitializer: Přidán nový produkt: {productToSeed.Name}");
                }
                else
                {
                    existingProduct.Name = productToSeed.Name;
                    existingProduct.Author = productToSeed.Author;
                    existingProduct.Director = productToSeed.Director;
                    existingProduct.Category = productToSeed.Category;
                    existingProduct.Genre = productToSeed.Genre;
                    existingProduct.Description = productToSeed.Description;
                    existingProduct.DateOfAcquisition = productToSeed.DateOfAcquisition;
                    existingProduct.Availability = productToSeed.Availability;

                    logger.LogInformation($"DbInitializer: Aktualizován existující produkt: {productToSeed.Name}");
                }         
            }
            await context.SaveChangesAsync();
            logger.LogInformation("DbInitializer: Products seeded successfully.");
        }
    }
}
