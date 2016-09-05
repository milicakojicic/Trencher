using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class Conversation
    {
        public long ID { get; set; }
        public List<Message> Messages { get; set; }
        public HashSet<User> Users { get; set; }
        public string Name { get; set; }

        public Conversation(IRecord record = null)
        {
            ID = (long)record["id"];
            Messages = (List<Message>)record["messages"];
            Users = (HashSet<User>)record["users"];
            Name = (string)record["name"];
        }
    }
}
