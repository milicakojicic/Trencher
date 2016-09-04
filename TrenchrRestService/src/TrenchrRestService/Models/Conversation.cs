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
        public List<User> Users { get; set; }
        public string Name { get; set; }
    }
}
