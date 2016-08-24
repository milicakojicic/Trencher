using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class Post
    {
        public long ID { get; set; }
        public long KursID { get; set; }
        public string Caption { get; set; }
        public string Type { get; set; }
        public string Text { get; set; }
        public string Important { get; set; }
        public DateTime Time{ get; set; }

        //dodatna polja vezana za autora post-a
        public long UserId { get; set; }
        public string PicturePath { get; set; }
        public string AuthorInfo { get; set; }


    }
}
