using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using TrenchrRestService;
using TrenchrRestService.Models;

namespace TrenchrRestService.Controllers
{
    
    public class PostController : ApiController
    {

        //postovi koji pripadaju nekom predmetu
        [Route("postovi/{id}")]
        [HttpGet]
        public IActionResult GetAllMaterials(long id)
        {
            var stmnt = $"MATCH (o:odrzan_kurs)-[:ima_post]-(post), (korisnik)-[:objavio]-(post) where id(o) = {id} return id(o) as id, post.tip as tip, post.name as naslov, post.putanja as putanja, post.tekst as tekst, post.ind as indikator, post.vreme as vreme, id(korisnik) as korisnik_id, korisnik.name as ime_korisnika, korisnik.putanja as putanja_korisnika";
            var resultPosts = Neo4jClient.Execute(stmnt);

            //mozda nam nekad bude trebalo
            var materials = new List<Material>();
            var results = new List<Results>();
            var votes = new List<Vote>();
            var notifications = new List<NotificationPost>();

            //lista postova koji se vracaju
            var posts = new List<Post>();

            foreach (var o in resultPosts) {

                if ((string)o["tip"] == "rez")
                {
                    materials.Add(new Material(o));
                    posts.Add(new Material(o));

                }
                else if ((string)o["tip"] == "mat")
                {
                    results.Add(new Results(o));
                    posts.Add(new Results(o));
                }
                else if ((string)o["tip"] == "glas")
                {
                    votes.Add(new Vote(o));
                    posts.Add(new Vote(o));
                }

                else if ((string)o["tip"] == "obav")
                {
                    notifications.Add(new NotificationPost(o));
                    posts.Add(new NotificationPost(o));
                }

            }
            return Ok(JsonConvert.SerializeObject(posts, Formatting.Indented));
         
        }


        //unos materijala za neki predmet
        [Route("materijali/")]
        [HttpPost]
        public IActionResult InsertMaterials(long id)
        {

          
        }

        [Route("rezultati/")]
        [HttpPost]
        public IActionResult InsertResults(long id)
        {

        }

        [Route("glasanje/")]
        [HttpPost]
        public IActionResult InsertVoting(long id)
        {

        }

        [Route("obavestenje/")]
        [HttpPost]
        public IActionResult InsertNotification(long id)
        {

        }



    }
}


