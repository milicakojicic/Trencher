using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class Comment
    {
        public int ID { get; set; }
        public string Text { get; set; }
        public DateTime Time { get; set; }
        //dodatna polja, student koji je okacio komentar + njegova slika + post na koji se odnosi
        public Student Student { get; set; }
        public string PicturePath{ get; set; }
    }
}
