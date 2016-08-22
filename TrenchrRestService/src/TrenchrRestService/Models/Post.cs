using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class Post
    {
        public int ID { get; set; }
        public string Text { get; set; }
        public int Important { get; set; }
        public long UserId { get; set; }
        public string PicturePath { get; set; }
        public string AuthorInfo { get; set; }
    }
}
