﻿namespace meetmeatApi.QueryParams
{
    public class ProductQueryParameters
    {
        private const int MaxPageSize = 50;

        public int PageNumber { get; set; } = 1; 

        private int _pageSize = 10;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }

        public string? Category { get; set; }
        public string? SearchTerm { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }


        public string? OrderBy { get; set; } 
    }
}
