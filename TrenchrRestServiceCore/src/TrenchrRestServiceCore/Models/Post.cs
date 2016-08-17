using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestServiceCore.Models
{
    public class Post
    {
        public string Title { get; set; }
        public string  Content { get; set; }
        public DateTime Time { get; set; }
    }
}
