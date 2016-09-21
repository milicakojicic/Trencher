using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class Faculty
    {
        public long ID { get; set; }
        public string Name { get; set; }
        public string University { get; set; }
        public string City { get; set; }

        public Faculty() { }

        public Faculty(IRecord record)
        {
            ID = (long)record["id"];
            Name = (string)record["name"];
            City = (string)record["city"];
            University = (string)record["university"];
        }
    }
}
