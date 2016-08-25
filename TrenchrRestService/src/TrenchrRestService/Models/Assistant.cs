using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class Assistant : User
    {
        public Assistant() { }

        public List<Faculty> fakulteti { get; set; }

        public Assistant(IRecord record)
        {
            ID = (long)record["id"];
            Name = (string)record["ime"];
            Surname = (string)record["prezime"];
            Email = (string)record["email"];
            PicturePath = (string)record["slika"];
        }
    }
}
