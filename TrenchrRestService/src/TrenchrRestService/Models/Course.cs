using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class Course
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int Espb { get; set; }
        public string Description { get; set; }
    }
}
