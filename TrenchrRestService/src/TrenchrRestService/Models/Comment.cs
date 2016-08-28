using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class Comment
    {
        public long ID { get; set; }
        public string Text { get; set; }
        public long Time { get; set; }
        
        // post na koji se odnosi
        public long ParentID { get; set; }

        //dodatna polja, student koji je okacio komentar + njegova slika 
        public long UserID { get; set; }
        public string PicturePath{ get; set; }
        public string AuthorInfo { get; set; }

        public Comment() { }

        public Comment(IRecord record)
        {
            ID = (long)record["id"];
            ParentID = (long)record["parent_id"];
            Text = (string)record["tekst"];
            Time = (long)record["vreme"];
            UserID = (long)record["user_id"];
            AuthorInfo = (string)record["ime"];
            PicturePath = (string)record["prezime"];

        }

        public long SacuvajKomentar()
        {
            var stmnt = "MATCH (post), (autor) " +
                       $"WHERE id(post) = {ParentID} AND id(autor) = {UserID} " +
                        " WITH post, autor " +
                        "CREATE (k:komentar {" +
                        $" tekst: '{Text}', " +
                        $" vreme : {Time}" +
                        "})-[:u_postu]->(post)<-[:komentarisao]-(autor) RETURN id(k) as id";

             var result = Neo4jClient.Execute(stmnt);
            return (long)result.FirstOrDefault()["id"];
        }

    }
}
