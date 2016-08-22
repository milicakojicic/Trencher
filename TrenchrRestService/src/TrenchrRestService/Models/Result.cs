using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class Result
    {
        public int ID { get; set; }
        public string Text { get; set; }
        public string Path { get; set; }
        //indikator da li je oznacen kao vazan ili ne
        public int Important { get; set; }
    }
}
