using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class HeldCourse
    {
        public long ID { get; set; }
        public string Name { get; set; }
        public long Espb { get; set; }
        public string Type { get; set; }
        public string Level { get; set; }
        public string Year { get; set; }


        public HeldCourse() { }

        public HeldCourse(IRecord record)
        {
            ID = (long)record["id"];
            Name = (string)record["name"];
            Espb = (long)record["espb"];
            Type = (string)record["tip"];
            Level = (string)record["nivo"];
            Year = (string)record["godina"];
        }
    }
}
