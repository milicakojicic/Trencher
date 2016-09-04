using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class Message
    {
        public long ID { get; set; }
        public long UserID { get; set; }
        public string Text { get; set; }
        public DateTime Time { get; set; }
        public long ConversationID { get; set; }

        public Message(IRecord record)
        {
            ID = (long)record["id"];
            UserID = (long)record["user_id"];
            Text = (string)record["tekst"];
            Time = (DateTime)record["vreme"];
            ConversationID = (long)record["conversation_id"];
        }

        public long SacuvajPoruku()
        {
            var stmnt = "MATCH (konverzacija), (autor) " +
                        $"WHERE id(konverzacija) = {ConversationID} AND id(autor) = {UserID} " +
                        " WITH konverzacija, autor " +
                        "CREATE (autor)-[:u_konverzaciji]->(konverzacija)-[:sadrzi_poruku]->(p:poruka { " +
                        $" tekst: '{Text}', " +
                        $" vreme : {Time}, " +
                        $" poslao : {UserID} " +
                        "}) RETURN id(p) as id";

            var result = Neo4jClient.Execute(stmnt);
            return (long)result.FirstOrDefault()["id"];
        }
    }
}
