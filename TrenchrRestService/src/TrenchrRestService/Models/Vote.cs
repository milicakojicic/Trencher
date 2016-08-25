using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class Vote : Post
    {
        //lista opcija glasanja
        public List<VoteOption> VoteOptions { get; set; }

        public Vote() { }

        public Vote(IRecord record)
        {

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

        public long SacuvajGlasanje()
        {
            var stmnt = "MATCH (ok:odrzan_kurs), (autor) " +
                       $"WHERE id(ok) = {KursID} AND id(autor) = {UserId} " +
                        " WITH ok,autor " +
                        "CREATE (ok)-[:ima_post]->(o:glasanje{" +
                        $" name : '{Caption}', " +
                        $" tekst : '{Text}', " +
                        $" tip : '{Type}', " +
                        $" ind :' {Important}', " +
                        $" vreme : '{Time.ToLocalTime()}', " +
                         "})<-[:objavio]-(autor) RETURN id(o) as id";
            var result = Neo4jClient.Execute(stmnt);
            return (long)result.FirstOrDefault()["id"];
        }
    }
}
