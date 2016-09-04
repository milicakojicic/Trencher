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

        //fakultet na kom je student, zasad samo jedan
        public string Faculty { get; set; }
        public string Module { get; set; }
        public string University { get; set; }

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
            Faculty = (string)record["fakultet"];
            University = (string)record["univerzitet"];
            Module = (string)record["smer"];
        }
    }
}
