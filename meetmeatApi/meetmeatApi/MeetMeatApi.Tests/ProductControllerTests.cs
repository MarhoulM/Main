using Xunit;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using meetmeatApi.Data;
using meetmeatApi.Models;
using meetmeatApi.Dtos;
using meetmeatApi.Controllers;
using meetmeatApi.QueryParams;
using meetmeatApi.Services;


namespace MeetMeatApi.Tests
{
    public class ProductControllerTests
    {
        //TESTS FOR GET METHOD
        [Fact]
        public async Task GetProducts_NoParam_ReturnAllProducts()
        {
            //ARRANGE
            var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()).Options;

            using var context = new ApplicationDbContext(options);
            await context.Database.EnsureCreatedAsync();

            var testProducts = new List<Product> { new Product
            {
                Id = 1,
                Name = "Product A",
                Price = 10.00m,
                Currency = "Kč",
                Category = "Category1",
                ImageUrl = "http://example.com/a.jpg",
                Description = "Description A",
                DetailDescription = new ProductDetailDescription
                {
                    MeatType = "TypeA", Process = "ProcA", Weight = "100g",
                    Nutrition = "NutA", Origin = "OrigA", ShelfLife = "6m"
                }
            },
            new Product
            {
                Id = 2,
                Name = "Product B",
                Price = 20.00m,
                Currency = "Kč",
                Category = "Category2",
                ImageUrl = "http://example.com/b.jpg",
                Description = "Description B",
                DetailDescription = new ProductDetailDescription
                {
                    MeatType = "TypeB", Process = "ProcB", Weight = "200g",
                    Nutrition = "NutB", Origin = "OrigB", ShelfLife = "12m"
                }
            }

            };

            context.Products.AddRange(testProducts);
            await context.SaveChangesAsync();

            var controller = new ProductsController(context);
            var queryParams = new ProductQueryParameters();

            //ACT

            var result = await controller.GetProducts(queryParams);

            //ASSERT

            Assert.IsType<OkObjectResult>(result.Result);

            var okResult = result.Result as OkObjectResult;
            Assert.NotNull(okResult);

            Assert.IsType<PagedResponse<ProductReadDto>>(okResult.Value);

            var pagedResponse = okResult.Value as PagedResponse<ProductReadDto>;
            Assert.NotNull(pagedResponse);

            Assert.Equal(testProducts.Count, pagedResponse.Data.Count());

            Assert.Equal(testProducts.Count, pagedResponse.TotalCount);

            var returnedProductIds = pagedResponse.Data.Select(p => p.Id).OrderBy(id => id).ToList();
            var seedProductIds = testProducts.Select(p => p.Id).OrderBy(id => id).ToList();
            Assert.Equal(seedProductIds, returnedProductIds);

            var returnedProductNames = pagedResponse.Data.Select(p => p.Name).OrderBy(name => name).ToList();
            var seedProductNames = testProducts.Select(p => p.Name).OrderBy(name => name).ToList();
            Assert.Equal(seedProductNames, returnedProductNames);
        }
        [Theory]
        [InlineData("Category1", 2)]
        [InlineData("Category2", 1)]
        [InlineData("NonExistingCategory", 0)]
        [InlineData("category1", 2)]
        public async Task GetProducts_ByCategoryFilter_ReturnFilteredProducts(string category, int expectedCount)
        {
            //ARRANGE
            var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()).Options;

            using var context = new ApplicationDbContext(options);
            await context.Database.EnsureCreatedAsync();
            var testProducts = new List<Product>
                {
                    new Product
                    {
                        Id = 1,
                        Name = "Product A",
                        Price = 10.00m,
                        Currency = "Kč",
                        Category = "Category1",
                        ImageUrl = "http://example.com/a.jpg",
                        Description = "Description A",
                        DetailDescription = new ProductDetailDescription
                        {
                            MeatType = "TypeA", Process = "ProcA", Weight = "100g",
                            Nutrition = "NutA", Origin = "OrigA", ShelfLife = "6m"
                        }
                    },
                    new Product
                    {
                        Id = 2,
                        Name = "Product B",
                        Price = 20.00m,
                        Currency = "Kč",
                        Category = "Category2",
                        ImageUrl = "http://example.com/b.jpg",
                        Description = "Description B",
                        DetailDescription = new ProductDetailDescription
                        {
                            MeatType = "TypeB", Process = "ProcB", Weight = "200g",
                            Nutrition = "NutB", Origin = "OrigB", ShelfLife = "12m"
                        }
                    },
                    new Product
                    {
                        Id = 3,
                        Name = "Product C",
                        Price = 30.00m,
                        Currency = "Kč",
                        Category = "Category1",
                        ImageUrl = "http://example.com/c.jpg",
                        Description = "Description C",
                        DetailDescription = new ProductDetailDescription
                        {
                            MeatType = "TypeC", Process = "ProcC", Weight = "300g",
                            Nutrition = "NutC", Origin = "OrigC", ShelfLife = "9m"
                        }
                    }
                };
            context.Products.AddRange(testProducts);
            await context.SaveChangesAsync();

            var controller = new ProductsController(context);
            var queryParams = new ProductQueryParameters { Category = category };

            //ACT

            var result = await controller.GetProducts(queryParams);

            //ASSERT

            Assert.IsType<OkObjectResult>(result.Result);

            var okResult = result.Result as OkObjectResult;
            Assert.NotNull(okResult);

            Assert.IsType<PagedResponse<ProductReadDto>>(okResult.Value);

            var pagedResponse = okResult.Value as PagedResponse<ProductReadDto>;
            Assert.NotNull(pagedResponse);

            Assert.Equal(expectedCount, pagedResponse.Data.Count());
            Assert.Equal(expectedCount, pagedResponse.TotalCount);

            if (expectedCount > 0)
            {
                var filteredSeedProducts = testProducts.Where(p => p.Category.ToLower() == category.ToLower()).ToList();

                var returnedProductIds = pagedResponse.Data.Select(p => p.Id).OrderBy(id => id).ToList();
                var filteredSeedProductIds = filteredSeedProducts.Select(p => p.Id).OrderBy(id => id).ToList();
                Assert.Equal(filteredSeedProductIds, returnedProductIds);

                var returnedProductNames = pagedResponse.Data.Select(p => p.Name).OrderBy(name => name).ToList();
                var filteredSeedProductNames = filteredSeedProducts.Select(p => p.Name).OrderBy(name => name).ToList();
                Assert.Equal(filteredSeedProductNames, returnedProductNames);
            }
            else
            {
                Assert.Empty(pagedResponse.Data);
            }
        }

        [Theory]
        [InlineData("Product", 3)]
        [InlineData("description A", 1)]
        [InlineData("xyz", 0)]
        [InlineData("product a", 1)]
        [InlineData("Description", 3)]
        public async Task GetProducts_BySearchTermFilter_ReturnsFilteredProducts(string searchTerm, int expectedCount)
        {
            //ARRANGE
            var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()).Options;

            using var context = new ApplicationDbContext(options);
            await context.Database.EnsureCreatedAsync();
            var testProducts = new List<Product>
                {
                    new Product
                    {
                        Id = 1,
                        Name = "Product A",
                        Price = 10.00m,
                        Currency = "Kč",
                        Category = "Category1",
                        ImageUrl = "http://example.com/a.jpg",
                        Description = "Description A for product A",
                        DetailDescription = new ProductDetailDescription
                        {
                            MeatType = "TypeA", Process = "ProcA", Weight = "100g",
                            Nutrition = "NutA", Origin = "OrigA", ShelfLife = "6m"
                        }
                    },
                    new Product
                    {
                        Id = 2,
                        Name = "Product B",
                        Price = 20.00m,
                        Currency = "Kč",
                        Category = "Category2",
                        ImageUrl = "http://example.com/b.jpg",
                        Description = "Description B for product B",
                        DetailDescription = new ProductDetailDescription
                        {
                            MeatType = "TypeB", Process = "ProcB", Weight = "200g",
                            Nutrition = "NutB", Origin = "OrigB", ShelfLife = "12m"
                        }
                    },
                    new Product
                    {
                        Id = 3,
                        Name = "Another Product C",
                        Price = 30.00m,
                        Currency = "Kč",
                        Category = "Category1",
                        ImageUrl = "http://example.com/c.jpg",
                        Description = "Description C for another product",
                        DetailDescription = new ProductDetailDescription
                        {
                            MeatType = "TypeC", Process = "ProcC", Weight = "300g",
                            Nutrition = "NutC", Origin = "OrigC", ShelfLife = "9m"
                        }
                    }
                };

            context.Products.AddRange(testProducts);
            await context.SaveChangesAsync();

            var controller = new ProductsController(context);
            var queryParams = new ProductQueryParameters { SearchTerm = searchTerm };

            //ACT
            var result = await controller.GetProducts(queryParams);

            //ASSERT
            Assert.IsType<OkObjectResult>(result.Result);

            var okResult = result.Result as OkObjectResult;
            Assert.NotNull(okResult);

            Assert.IsType<PagedResponse<ProductReadDto>>(okResult.Value);

            var pagedResponse = okResult.Value as PagedResponse<ProductReadDto>;
            Assert.NotNull(pagedResponse);

            Assert.Equal(expectedCount, pagedResponse.Data.Count());
            Assert.Equal(expectedCount, pagedResponse.TotalCount);

            if (expectedCount > 0)
            {
                var filteredSeedProducts = testProducts.Where(p =>
                    (p.Name != null && p.Name.ToLower().Contains(searchTerm.ToLower())) ||
                    (p.Description != null && p.Description.ToLower().Contains(searchTerm.ToLower()))
                ).ToList();

                var returnedProductIds = pagedResponse.Data.Select(p => p.Id).OrderBy(id => id).ToList();
                var filteredSeedProductIds = filteredSeedProducts.Select(p => p.Id).OrderBy(id => id).ToList();
                Assert.Equal(filteredSeedProductIds, returnedProductIds);

                var returnedProductNames = pagedResponse.Data.Select(p => p.Name).OrderBy(name => name).ToList();
                var filteredSeedProductNames = filteredSeedProducts.Select(p => p.Name).OrderBy(name => name).ToList();
                Assert.Equal(filteredSeedProductNames, returnedProductNames);
            }
            else
            {
                Assert.Empty(pagedResponse.Data);
            }
        }

        [Theory]

        [InlineData(null, null, 3)]
        [InlineData(15.00, null, 2)]
        [InlineData(null, 25.00, 2)]
        [InlineData(15.00, 25.00, 1)]
        [InlineData(50.00, null, 0)]
        [InlineData(null, 5.00, 0)]
        [InlineData(10.00, 10.00, 1)]
        public async Task GetProducts_ByPriceFilters_ReturnsFilteredProducts(double? minPriceDouble, double? maxPriceDouble, int expectedCount)
        {
            // ARRANGE
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using var context = new ApplicationDbContext(options);
            await context.Database.EnsureCreatedAsync();

            var testProducts = new List<Product>
                {
                    new Product
                    {
                        Id = 1,
                        Name = "Product A",
                        Price = 10.00m,
                        Currency = "Kč",
                        Category = "Category1",
                        ImageUrl = "http://example.com/a.jpg",
                        Description = "Description A",
                        DetailDescription = new ProductDetailDescription
                        { MeatType = "TypeA",
                            Process = "ProcA",
                            Weight = "100g",
                            Nutrition = "NutA",
                            Origin = "OrigA",
                            ShelfLife = "6m" }
                    },
                    new Product
                    {
                        Id = 2,
                        Name = "Product B",
                        Price = 20.00m,
                        Currency = "Kč",
                        Category = "Category2",
                        ImageUrl = "http://example.com/b.jpg",
                        Description = "Description B",
                        DetailDescription = new ProductDetailDescription
                        { MeatType = "TypeB",
                            Process = "ProcB",
                            Weight = "200g",
                            Nutrition = "NutB",
                            Origin = "OrigB",
                            ShelfLife = "12m" }
                    },
                    new Product
                    {
                        Id = 3,
                        Name = "Product C",
                        Price = 30.00m,
                        Currency = "Kč",
                        Category = "Category1",
                        ImageUrl = "http://example.com/c.jpg",
                        Description = "Description C",
                        DetailDescription = new ProductDetailDescription
                        { MeatType = "TypeC",
                            Process = "ProcC",
                            Weight = "300g",
                            Nutrition = "NutC",
                            Origin = "OrigC",
                            ShelfLife = "9m" }
                    }
                };
            context.Products.AddRange(testProducts);
            await context.SaveChangesAsync();


            var controller = new ProductsController(context);

            decimal? minPrice = minPriceDouble.HasValue ? (decimal?)minPriceDouble.Value : null;
            decimal? maxPrice = maxPriceDouble.HasValue ? (decimal?)maxPriceDouble.Value : null;

            var queryParams = new ProductQueryParameters
            {
                MinPrice = minPrice,
                MaxPrice = maxPrice
            };


            //ACT
            var result = await controller.GetProducts(queryParams);


            // ASSERT
            Assert.IsType<OkObjectResult>(result.Result);

            var okResult = result.Result as OkObjectResult;
            Assert.NotNull(okResult);

            Assert.IsType<PagedResponse<ProductReadDto>>(okResult.Value);

            var pagedResponse = okResult.Value as PagedResponse<ProductReadDto>;
            Assert.NotNull(pagedResponse);

            Assert.Equal(expectedCount, pagedResponse.Data.Count());

            Assert.Equal(expectedCount, pagedResponse.TotalCount);

            if (expectedCount > 0)
            {
                var filteredSeedProducts = testProducts.Where(p =>
                    (!minPrice.HasValue || p.Price >= minPrice.Value) &&
                    (!maxPrice.HasValue || p.Price <= maxPrice.Value)
                ).ToList();

                var returnedProductIds = pagedResponse.Data.Select(p => p.Id).OrderBy(id => id).ToList();
                var filteredSeedProductIds = filteredSeedProducts.Select(p => p.Id).OrderBy(id => id).ToList();
                Assert.Equal(filteredSeedProductIds, returnedProductIds);

                var returnedProductNames = pagedResponse.Data.Select(p => p.Name).OrderBy(name => name).ToList();
                var filteredSeedProductNames = filteredSeedProducts.Select(p => p.Name).OrderBy(name => name).ToList();
                Assert.Equal(filteredSeedProductNames, returnedProductNames);
            }
            else
            {
                Assert.Empty(pagedResponse.Data);
            }
        }

        [Fact]
        public async Task GetProduct_ExistingId_ReturnProduct()
        {
            //ARRANGE
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
          .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
          .Options;

            using var context = new ApplicationDbContext(options);
            await context.Database.EnsureCreatedAsync();
            var expectedProduct = new Product
            {
                Id = 100,
                Name = "Single Test Product",
                Price = 99.99m,
                Currency = "Kč",
                Category = "TestCategory",
                ImageUrl = "http://example.com/single.jpg",
                Description = "A product for single retrieval test.",
                DetailDescription = new ProductDetailDescription
                {
                    MeatType = "TestType",
                    Process = "TestProcess",
                    Weight = "100g",
                    Nutrition = "TestNut",
                    Origin = "TestOrigin",
                    ShelfLife = "TestShelf"
                }
            };

            context.Products.Add(expectedProduct);
            await context.SaveChangesAsync();

            var controller = new ProductsController(context);

            //ACT
            var result = await controller.GetProduct(expectedProduct.Id);

            //ASSERT
            Assert.IsType<OkObjectResult>(result.Result);

            var okResult = result.Result as OkObjectResult;
            Assert.NotNull(okResult); 

            Assert.IsType<ProductReadDto>(okResult.Value);

            var productDto = okResult.Value as ProductReadDto;
            Assert.NotNull(productDto);

            Assert.Equal(expectedProduct.Id, productDto.Id);
            Assert.Equal(expectedProduct.Name, productDto.Name);
            Assert.Equal(expectedProduct.Price, productDto.Price);
            Assert.Equal(expectedProduct.Currency, productDto.Currency);
            Assert.Equal(expectedProduct.Category, productDto.Category);
            Assert.Equal(expectedProduct.ImageUrl, productDto.ImageUrl);
            Assert.Equal(expectedProduct.Description, productDto.Description);

            Assert.NotNull(productDto.DetailDescription);
            Assert.Equal(expectedProduct.DetailDescription.MeatType, productDto.DetailDescription.MeatType);
            Assert.Equal(expectedProduct.DetailDescription.Process, productDto.DetailDescription.Process);
            Assert.Equal(expectedProduct.DetailDescription.Weight, productDto.DetailDescription.Weight);
            Assert.Equal(expectedProduct.DetailDescription.Nutrition, productDto.DetailDescription.Nutrition);
            Assert.Equal(expectedProduct.DetailDescription.Origin, productDto.DetailDescription.Origin);
            Assert.Equal(expectedProduct.DetailDescription.ShelfLife, productDto.DetailDescription.ShelfLife);
        }
        [Fact]
        public async Task GetProduct_NonExistingId_ReturnsNotFound()
        {
            //ARRANGE 

            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using var context = new ApplicationDbContext(options);
            await context.Database.EnsureCreatedAsync();

            Assert.Equal(0, await context.Products.CountAsync());

            var controller = new ProductsController(context);

            var nonExistingId = 999;

            //ACT
            var result = await controller.GetProduct(nonExistingId);

            //ASSERT
            Assert.IsType<NotFoundObjectResult>(result.Result); 

            var notFoundResult = result.Result as NotFoundObjectResult;
            Assert.NotNull(notFoundResult);
            Assert.Contains($"Produkt s ID {nonExistingId} nebyl nalezen.", notFoundResult.Value.ToString());

            Assert.Null(result.Value);
        }
        //TESTS FOR POST METHOD
        [Fact]
        public async Task UpdateProduct_ExistingValidProduct_ReturnsNoContentAndUpdatesProduct()
        {
            //ARRANGE
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using var context = new ApplicationDbContext(options);
            await context.Database.EnsureCreatedAsync();

            var existingProduct = new Product
            {
                Id = 200,
                Name = "Original Product Name",
                Price = 100.00m,
                Currency = "Kč",
                Category = "OriginalCategory",
                ImageUrl = "http://example.com/original.jpg",
                Description = "Original description.",
                DetailDescription = new ProductDetailDescription
                {
                    MeatType = "OriginalMeat",
                    Process = "OriginalProcess",
                    Weight = "100g",
                    Nutrition = "OriginalNut",
                    Origin = "OriginalOrigin",
                    ShelfLife = "OriginalShelf"
                }
            };
            context.Products.Add(existingProduct);
            await context.SaveChangesAsync();

            Assert.Equal(1, await context.Products.CountAsync());
            Assert.Equal(existingProduct.Name, (await context.Products.FirstAsync()).Name);

            var controller = new ProductsController(context);

            var updateDto = new ProductUpdateDto
            {
                Name = "Updated Product Name",
                Price = 150.00m,
                Currency = "Eur",
                Category = "UpdatedCategory",
                ImageUrl = "http://example.com/updated.jpg",
                Description = "Updated description for product.",
                DetailDescription = new ProductDetailDescriptionUpdateDto
                {
                    MeatType = "UpdatedMeat",
                    Process = "UpdatedProcess",
                    Weight = "200g",
                    Nutrition = "UpdatedNut",
                    Origin = "UpdatedOrigin",
                    ShelfLife = "UpdatedShelf"
                }
            };

            //ACT
            var result = await controller.UpdateProduct(existingProduct.Id, updateDto);

            //ASSERT
            Assert.IsType<NoContentResult>(result);

            var updatedProductInDb = await context.Products
                .Include(p => p.DetailDescription)
                .FirstOrDefaultAsync(p => p.Id == existingProduct.Id);

            Assert.NotNull(updatedProductInDb); 
            Assert.Equal(1, await context.Products.CountAsync());

            Assert.Equal(updateDto.Name, updatedProductInDb.Name);
            Assert.Equal(updateDto.Price, updatedProductInDb.Price);
            Assert.Equal(updateDto.Currency, updatedProductInDb.Currency);
            Assert.Equal(updateDto.Category, updatedProductInDb.Category);
            Assert.Equal(updateDto.ImageUrl, updatedProductInDb.ImageUrl);
            Assert.Equal(updateDto.Description, updatedProductInDb.Description);

            Assert.NotNull(updatedProductInDb.DetailDescription);
            Assert.Equal(updateDto.DetailDescription.MeatType, updatedProductInDb.DetailDescription.MeatType);
            Assert.Equal(updateDto.DetailDescription.Process, updatedProductInDb.DetailDescription.Process);
            Assert.Equal(updateDto.DetailDescription.Weight, updatedProductInDb.DetailDescription.Weight);
            Assert.Equal(updateDto.DetailDescription.Nutrition, updatedProductInDb.DetailDescription.Nutrition);
            Assert.Equal(updateDto.DetailDescription.Origin, updatedProductInDb.DetailDescription.Origin);
            Assert.Equal(updateDto.DetailDescription.ShelfLife, updatedProductInDb.DetailDescription.ShelfLife);
        }

        [Fact]
        public async Task UpdateProduct_NonExistingProduct_ReturnsNotFound()
        {
            //ARRANGE
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using var context = new ApplicationDbContext(options);
            await context.Database.EnsureCreatedAsync();

            Assert.Equal(0, await context.Products.CountAsync());

            var controller = new ProductsController(context);
            var nonExistingId = 998;

            var updateDto = new ProductUpdateDto
            {
                Name = "Attempt to update",
                Price = 10.00m
            };

            //ACT 
            var result = await controller.UpdateProduct(nonExistingId, updateDto);

            //ASSERT
            Assert.IsType<NotFoundObjectResult>(result);

            var notFoundResult = result as NotFoundObjectResult;
            Assert.NotNull(notFoundResult);
            Assert.Contains($"Produkt s ID {nonExistingId} nebyl nalezen.", notFoundResult.Value.ToString());

            Assert.Equal(0, await context.Products.CountAsync());
        }

        [Fact]
        public async Task UpdateProduct_ExistingProductWithInvalidData_ReturnsBadRequest()
        {
            //ARRANGE
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using var context = new ApplicationDbContext(options);
            await context.Database.EnsureCreatedAsync();

            var existingProduct = new Product
            {
                Id = 201,
                Name = "Product to be updated with invalid data",
                Price = 100.00m,
                Currency = "Kč",
                Category = "Category",
                ImageUrl = "http://example.com/original.jpg",
                Description = "Original description.",
                DetailDescription = new ProductDetailDescription
                {
                    MeatType = "OriginalMeat",
                    Process = "OriginalProcess",
                    Weight = "100g",
                    Nutrition = "OriginalNut",
                    Origin = "OriginalOrigin",
                    ShelfLife = "OriginalShelf"
                }
            };
            context.Products.Add(existingProduct);
            await context.SaveChangesAsync();

            Assert.Equal(1, await context.Products.CountAsync());

            var controller = new ProductsController(context);

            var updateDto = new ProductUpdateDto
            {
                Name = "", // NEPLATNÁ HODNOTA: Prázdný název
                Price = 150.00m 
            };

            controller.ModelState.AddModelError("Name", "The Name field cannot be empty.");

            //ACT
            var result = await controller.UpdateProduct(existingProduct.Id, updateDto);

            //ASSERT
            Assert.IsType<BadRequestObjectResult>(result);

            var badRequestResult = result as BadRequestObjectResult;
            Assert.NotNull(badRequestResult);

            Assert.IsType<SerializableError>(badRequestResult.Value);
            var errors = badRequestResult.Value as SerializableError;
            Assert.NotNull(errors);
            Assert.True(errors.ContainsKey("Name"));
            Assert.Contains("The Name field cannot be empty.", (string[])errors["Name"]);

            var productInDbAfterAttempt = await context.Products
                .FirstOrDefaultAsync(p => p.Id == existingProduct.Id);

            Assert.NotNull(productInDbAfterAttempt);
            Assert.Equal("Product to be updated with invalid data", productInDbAfterAttempt.Name);
        }
        //TESTS FOR DELETE METHOD
        [Fact]
        public async Task DeleteProduct_ExistingProduct_ReturnsNoContentAndDeletesProduct()
        {
            //ARRANGE

            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using var context = new ApplicationDbContext(options);
            await context.Database.EnsureCreatedAsync();

            var productToDelete = new Product
            {
                Id = 300,
                Name = "Product to Delete",
                Price = 50.00m,
                Currency = "Kč",
                Category = "CategoryX",
                ImageUrl = "http://example.com/delete.jpg",
                Description = "Description for product to be deleted.",
                DetailDescription = new ProductDetailDescription
                {
                    MeatType = "TypeX",
                    Process = "ProcX",
                    Weight = "100g",
                    Nutrition = "NutX",
                    Origin = "OrigX",
                    ShelfLife = "6m"
                }
            };
            context.Products.Add(productToDelete);
            await context.SaveChangesAsync();

            Assert.Equal(1, await context.Products.CountAsync());

            var controller = new ProductsController(context);

            //ACT
            var result = await controller.DeleteProduct(productToDelete.Id);


            //ASSERT

            Assert.IsType<NoContentResult>(result);

            Assert.Equal(0, await context.Products.CountAsync());

            var deletedProductInDb = await context.Products.FindAsync(productToDelete.Id);
            Assert.Null(deletedProductInDb);
        }

        [Fact]
        public async Task DeleteProduct_NonExistingProduct_ReturnsNotFound()
        {
            //ARRANGE
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using var context = new ApplicationDbContext(options);
            await context.Database.EnsureCreatedAsync();

            Assert.Equal(0, await context.Products.CountAsync());

            var controller = new ProductsController(context);

            var nonExistingId = 997;

            //ACT
            var result = await controller.DeleteProduct(nonExistingId);

            //ASSERT

            Assert.IsType<NotFoundObjectResult>(result);

            var notFoundResult = result as NotFoundObjectResult;
            Assert.NotNull(notFoundResult);
            Assert.Contains($"Produkt s ID {nonExistingId} nebyl nalezen.", notFoundResult.Value.ToString());

            Assert.Equal(0, await context.Products.CountAsync());
        }
    }
}
