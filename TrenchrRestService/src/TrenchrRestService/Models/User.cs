using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class User
    {
        public long ID { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string PicturePath { get; set; }

        public User(IRecord record)
        {
            ID = (long)record["id"];
            Name = (string)record["name"];
            Surname = (string)record["surname"];
            Email = (string)record["email"];
            PicturePath = (string)record["picture_path"];
        }
    }
}
