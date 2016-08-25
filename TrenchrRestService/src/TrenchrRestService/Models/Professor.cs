using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class Professor : User
    {
        public Professor() { }

        public List<Faculty> fakulteti { get; set; }

        public Professor(IRecord record)
        {
            ID = (long)record["id"];
            Name = (string)record["ime"];
            Surname = (string)record["prezime"];
            Email = (string)record["email"];
            PicturePath = (string)record["slika"];
        }
    }
}
