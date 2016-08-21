using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class Message
    {
        public int ID { get; set; }
        public string Text { get; set; }
        public DateTime Time { get; set; }
        public string Sender { get; set; }
        public string Receiver { get; set; }

    }
}
