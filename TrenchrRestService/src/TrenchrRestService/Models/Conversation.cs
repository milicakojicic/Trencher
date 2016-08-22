using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class Conversation
    {
        public long ID { get; set; }
        public long ID1 { get; set; }
        public long ID2 { get; set; }
        public List<Message> Messages { get; set; }

    }
}
