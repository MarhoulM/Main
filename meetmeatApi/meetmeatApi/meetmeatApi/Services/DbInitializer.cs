using meetmeatApi.Data;
using meetmeatApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace meetmeatApi.Services
{
    public static class DbInitializer 
    {

        public static async Task Initialize(ApplicationDbContext context, ILogger<Program> logger) 
        {

            if (context.Database.IsRelational())
            {
                logger.LogInformation("DbInitializer: Applying migrations to relational database...");
                await context.Database.MigrateAsync();
                logger.LogInformation("DbInitializer: Migrations applied successfully.");
            }
            else
            {
                logger.LogInformation("DbInitializer: Using non-relational database (e.g., in-memory). Skipping MigrateAsync.");
            }


            logger.LogInformation("DbInitializer: Seeding products...");

            var products = new List<Product>
            {
                new Product
                {
                    Id = 1,
                    Name = "Hovězí Jerky Klasik",
                    Price = 280,
                    Currency = "Kč",
                    ImageUrl = "/images/MM1.jpeg",
                    Description = "Tradiční hovězí jerky, jemně kořeněné, sušené do křupava.",
                    Category = "Hovězí",
                    DetailDescription = new ProductDetailDescription
                    {
                        MeatType = "Libové hovězí maso (zadní, roštěnec)",
                        Process = "Maso je nakrájeno na tenké plátky, marinováno v naší tajné směsi koření (česnek, cibule, pepř, paprika) po dobu 24 hodin a poté pomalu sušeno při nízké teplotě po dobu 8-12 hodin pro optimální křupavost a zachování živin.",
                        Weight = "50g balení",
                        Nutrition = "Vysoký obsah bílkovin (cca 40g na balení), nízký obsah tuku.",
                        Origin = "Česká republika",
                        ShelfLife = "Spotřebujte do 6 měsíců od data výroby. Skladujte v suchu a chladu."
                    }
                },
                new Product
                {
                    Id = 2,
                    Name = "Vepřové Jerky Pikantní",
                    Price = 260,
                    Currency = "Kč",
                    ImageUrl = "/images/MMVP.jpeg",
                    Description = "Pikantní vepřové maso s chilli a uzenou paprikou, pro milovníky ostrých chutí.",
                    Category = "Vepřové",
                    DetailDescription = new ProductDetailDescription
                    {
                        MeatType = "Libové vepřové maso (kýta)",
                        Process = "Plátky vepřového masa jsou naloženy do marinády s výběrovým chilli (např. Habanero, Kajenský pepř) a uzenou paprikou. Následně se maso suší po dobu 10-14 hodin, aby se rozvinula plná pikantní chuť s kouřovým podtónem.",
                        Weight = "50g balení",
                        Nutrition = "Bohaté na bílkoviny, dodává energii. Obsahuje přírodní antioxidanty z papriky.",
                        Origin = "Česká republika",
                        ShelfLife = "Spotřebujte do 6 měsíců od data výroby. Skladujte v suchu a chladu."
                    }
                },
                new Product
                {
                    Id = 3,
                    Name = "Kuřecí Strips Sladké Chilli",
                    Price = 220,
                    Currency = "Kč",
                    ImageUrl = "/images/MM3.jpeg",
                    Description = "Lehké kuřecí maso s exotickou sladko-chilli marinádou.",
                    Category = "Kuřecí",
                    DetailDescription = new ProductDetailDescription
                    {
                        MeatType = "Kuřecí prsní řízky",
                        Process = "Kuřecí strips jsou marinované ve sladko-chilli omáčce s nádechem zázvoru a limetky. Sušení probíhá kratší dobu (6-10 hodin) pro zachování jemnosti masa.",
                        Weight = "40g balení",
                        Nutrition = "Velmi libové maso, nízký obsah tuku, ideální pro sportovce. Lehce stravitelné.",
                        Origin = "Česká republika",
                        ShelfLife = "Spotřebujte do 5 měsíců od data výroby. Skladujte v suchu a chladu."
                    }
                },
                new Product
                {
                    Id = 4,
                    Name = "Sušené Hovězí Maso s Pepřem",
                    Price = 290,
                    Currency = "Kč",
                    ImageUrl = "/images/MM1.jpeg",
                    Description = "Kousky prémiového hovězího s čerstvě mletým černým pepřem.",
                    Category = "Hovězí",
                    DetailDescription = new ProductDetailDescription
                    {
                        MeatType = "Kvalitní hovězí svíčková",
                        Process = "Vybrané kousky svíčkové jsou ručně obaleny v hrubě mletém černém pepři a po krátké marinaci sušeny po dobu 12-16 hodin, aby se pepřová chuť plně propojila s masem.",
                        Weight = "50g balení",
                        Nutrition = "Vysoce kvalitní bílkoviny, bohaté na železo a zinek. Pepř podporuje trávení.",
                        Origin = "Česká republika",
                        ShelfLife = "Spotřebujte do 6 měsíců od data výroby. Skladujte v suchu a chladu."
                    }
                },
                new Product
                {
                    Id = 5,
                    Name = "Sušené Vepřové Maso s Česnekem",
                    Price = 270,
                    Currency = "Kč",
                    ImageUrl = "/images/MM2.jpeg",
                    Description = "Intenzivní chuť česneku a bylinek na vepřovém mase.",
                    Category = "Vepřové",
                    DetailDescription = new ProductDetailDescription
                    {
                        MeatType = "Vepřová panenka",
                        Process = "Jemné plátky vepřové panenky jsou marinované v česnekové pastě s provensálskými bylinkami (rozmarýn, tymián, oregano). Sušení probíhá 10-12 hodin, čímž vznikne aromatická a plná chuť.",
                        Weight = "50g balení",
                        Nutrition = "Zdroj kvalitních bílkovin. Česnek je známý pro své prospěšné účinky.",
                        Origin = "Česká republika",
                        ShelfLife = "Spotřebujte do 6 měsíců od data výroby. Skladujte v suchu a chladu."
                    }
                },
                new Product
                {
                    Id = 6,
                    Name = "Sušené Krůtí Maso Teriyaki",
                    Price = 240,
                    Currency = "Kč",
                    ImageUrl = "/images/MM3.jpeg",
                    Description = "Jemné krůtí maso s typickou sladko-slanou teriyaki marinádou.",
                    Category = "Kuřecí",
                    DetailDescription = new ProductDetailDescription
                    {
                        MeatType = "Krůtí prsní řízky",
                        Process = "Krůtí maso je nakrájeno na strips a marinováno v autentické teriyaki omáčce (sójová omáčka, mirin, sake, zázvor, česnek). Sušení trvá 7-11 hodin, maso zůstává jemné a šťavnaté.",
                        Weight = "45g balení",
                        Nutrition = "Velmi nízký obsah tuku a vysoký obsah bílkovin, ideální pro fitness.",
                        Origin = "Česká republika",
                        ShelfLife = "Spotřebujte do 5 měsíců od data výroby. Skladujte v suchu a chladu."
                    }
                },
                new Product
                {
                    Id = 7,
                    Name = "Hovězí Jerky Extra Pálivé",
                    Price = 300,
                    Currency = "Kč",
                    ImageUrl = "/images/MM1.jpeg",
                    Description = "Pro ty, kteří se nebojí výzvy! Opravdu pálivé hovězí jerky.",
                    Category = "Hovězí",
                    DetailDescription = new ProductDetailDescription
                    {
                        MeatType = "Libové hovězí maso (zadní)",
                        Process = "Plátky hovězího masa jsou naloženy do extrémně pálivé marinády s Jolokií a Scorpion papričkami. Sušení probíhá 10-14 hodin, aby se ostrá chuť dokonale propojila s masem. **Upozornění: Velmi pálivé!**",
                        Weight = "45g balení",
                        Nutrition = "Vysoký obsah bílkovin. Kapsaicin v chilli papričkách může zrychlit metabolismus.",
                        Origin = "Česká republika",
                        ShelfLife = "Spotřebujte do 6 měsíců od data výroby. Skladujte v suchu a chladu."
                    }
                },
                new Product
                {
                    Id = 8,
                    Name = "Mix Sušených Masíček",
                    Price = 350,
                    Currency = "Kč",
                    ImageUrl = "/images/MM1.jpeg",
                    Description = "Výběr toho nejlepšího z naší nabídky sušených mas, ideální na ochutnávku.",
                    Category = "Mix",
                    DetailDescription = new ProductDetailDescription
                    {
                        MeatType = "Kombinace hovězího, vepřového a kuřecího masa.",
                        Process = "Mix obsahuje vybrané kousky z našich nejoblíbenějších druhů jerky. Každý typ masa je marinován a sušen dle vlastních specifikací, aby byla zachována jeho unikátní chuť a textura.",
                        Weight = "70g balení (různé poměry mas)",
                        Nutrition = "Komplexní zdroj bílkovin z různých druhů masa. Pestrá paleta chutí.",
                        Origin = "Česká republika",
                        ShelfLife = "Spotřebujte do 6 měsíců od data výroby. Skladujte v suchu a chladu."
                    }
                },
                new Product
                {
                    Id = 9,
                    Name = "Sušená Zvěřina s Bylinkami",
                    Price = 380,
                    Currency = "Kč",
                    ImageUrl = "/images/MM1.jpeg",
                    Description = "Exkluzivní sušené maso z divočiny s aromatickými lesními bylinkami.",
                    Category = "Zvěřina",
                    DetailDescription = new ProductDetailDescription
                    {
                        MeatType = "Kvalitní zvěřina (např. jelen, divočák)",
                        Process = "Maso ze zvěřiny je pečlivě vybráno a marinováno v bohaté směsi lesních bylinek (jalovec, tymián, rozmarýn) a červeného vína. Pomalé sušení po dobu 14-18 hodin zvýrazňuje jeho specifickou a bohatou chuť.",
                        Weight = "50g balení",
                        Nutrition = "Velmi libové maso, bohaté na bílkoviny a minerály. Autentická chuť divočiny.",
                        Origin = "Česká republika (s důrazem na udržitelné zdroje)",
                        ShelfLife = "Spotřebujte do 6 měsíců od data výroby. Skladujte v suchu a chladu."
                    }
                },
                new Product
                {
                    Id = 10,
                    Name = "Sušené Hovězí Maso Sriracha",
                    Price = 295,
                    Currency = "Kč",
                    ImageUrl = "/images/MM1.jpeg",
                    Description = "Hovězí maso s oblíbenou pálivou omáčkou Sriracha pro pikantní zážitek.",
                    Category = "Hovězí",
                    DetailDescription = new ProductDetailDescription
                    {
                        MeatType = "Libové hovězí maso (zadní)",
                        Process = "Hovězí plátky jsou marinovány v autentické Sriracha omáčce s česnekem a trochou cukru. Proces sušení (10-12 hodin) zajišťuje, že se pálivá a mírně sladká chuť Srirachi dokonale vstřebá do masa.",
                        Weight = "50g balení",
                        Nutrition = "Vysoký podíl bílkovin, dodává energii. Výrazná chuť, která probudí chuťové pohárky.",
                        Origin = "Česká republika",
                        ShelfLife = "Spotřebujte do 6 měsíců od data výroby. Skladujte v suchu a chladu."
                    }
                }
            };

            foreach (var productToSeed in products)
            {
 
                var existingProduct = await context.Products.FindAsync(productToSeed.Id);

                if (existingProduct == null)
                {
                    context.Products.Add(productToSeed);
                    logger.LogInformation($"DbInitializer: Přidán nový produkt: {productToSeed.Name}");
                }
                else
                {
                    existingProduct.Name = productToSeed.Name;
                    existingProduct.Price = productToSeed.Price;
                    existingProduct.Currency = productToSeed.Currency;
                    existingProduct.ImageUrl = productToSeed.ImageUrl;
                    existingProduct.Description = productToSeed.Description;
                    existingProduct.Category = productToSeed.Category;

  
                    if (existingProduct.DetailDescription == null)
                    {
                        existingProduct.DetailDescription = productToSeed.DetailDescription;
                    }
                    else
                    {
                        existingProduct.DetailDescription.MeatType = productToSeed.DetailDescription.MeatType;
                        existingProduct.DetailDescription.Process = productToSeed.DetailDescription.Process;
                        existingProduct.DetailDescription.Weight = productToSeed.DetailDescription.Weight;
                        existingProduct.DetailDescription.Nutrition = productToSeed.DetailDescription.Nutrition;
                        existingProduct.DetailDescription.Origin = productToSeed.DetailDescription.Origin;
                        existingProduct.DetailDescription.ShelfLife = productToSeed.DetailDescription.ShelfLife;
                    }

                    context.Products.Update(existingProduct); 
                    logger.LogInformation($"DbInitializer: Aktualizován existující produkt: {productToSeed.Name}");
                }
            }
            await context.SaveChangesAsync();
            logger.LogInformation("DbInitializer: Products seeded successfully.");
        }
    }
}
