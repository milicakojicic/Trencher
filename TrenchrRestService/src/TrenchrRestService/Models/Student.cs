using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class Student : User
    {
       
        public long Year { get; set; }
        public string Index { get; set; }
 
        public Student() { }

        public Student(IRecord record)
        {
            ID = (long)record["id"];
            Name = (string)record["ime"];
            Surname = (string)record["prezime"];
            Year = (long)record["generacija"];
            Index = (string)record["indeks"];
            Email = (string)record["email"];
            PicturePath = (string)record["slika"];
        }
    }
}
