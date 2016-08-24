using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class Results : Post
    {
       
        public string Path { get; set; }

        public Results() { }

        public Results(IRecord record)
        {

            Path = (string)record["putanja"];
            ID = (long)record["id"];
            KursID = (long)record["kurs_id"];
            Caption = (string)record["naslov"];
            Type = (string)record["tip"];
            Text = (string)record["tekst"];
            Important = (string)record["indikator"];
            Time = Convert.ToDateTime((string)record["vreme"]);
            UserId = (long)record["korisnik_id"];
            AuthorInfo = (string)record["ime_korisnika"];
            PicturePath = (string)record["putanja_korisnika"];

        }

    }
}
