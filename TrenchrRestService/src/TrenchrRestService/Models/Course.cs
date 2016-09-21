using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class Course
    {
        public long ID { get; set; }
        public string Name { get; set; }
        public long Espb { get; set; }
        public string Description { get; set; }

        // treba nam smer i fakultet kom predmet pripada
        public string Module { get; set; }
        public string Faculty { get; set; }

        public Course() { }

        public Course(IRecord record)
        {
            ID = (long)record["id"];
            Name = (string)record["name"];
            Espb = (long)record["espb"];
            Description = (string)record["opis"];
            Module  = (string)record["smer"];
            Faculty = (string)record["fakultet"];
        }
    }
}
