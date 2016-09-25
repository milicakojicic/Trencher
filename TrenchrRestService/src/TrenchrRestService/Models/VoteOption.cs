using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class VoteOption
    {

        public long ID { get; set; }
        public long VoteID { get; set; }
        public string Text { get; set; }
        //inicijalizovace se na 0 i svaki put ce da se uvecava 
        public long VotesCount { get; set; }

        public VoteOption() { }

        public VoteOption(IRecord record)
        {
            ID = (long)record["id"];
            VoteID = (long)record["roditelj_id"];
            Text = (string)record["text"];
            VotesCount = (long)record["broj_glasova"];
        }

        //vezi je za odredjeno glasanje, i inicijalno je broj glasova 0
        //OVDE NE RADI KONVERZIJA json number->long videti kako to
        //ParentId je id posta koji nije deo json-a
        public long SacuvajOpcijuGlasanja()
        {
            var stmnt = "MATCH (g:glasanje)" +
                       $"WHERE id(g) = {VoteID}" +
                        " WITH g " +
                        "CREATE (o:opcija{" +
                       $" tekst : '{Text}', " +
                       $" brGlasova : {0} " +
                        "})-[:u_glasanju]->(g) RETURN id(o) as id";
            var result = Neo4jClient.Execute(stmnt);
            return (long)result.FirstOrDefault()["id"];
        }
    }
}
