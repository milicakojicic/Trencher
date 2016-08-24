using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using TrenchrRestService;
using TrenchrRestService.Models;
using Newtonsoft.Json.Linq;

namespace TrenchrRestService.Controllers
{
    
    public class MaterialController : ApiController
    {

        //materijali koji pripadaju nekom predmetu
        [Route("postovi/{id}")]
        [HttpGet]
        public IActionResult GetAllMaterials(long id)
        {


            var stmnt = $"MATCH (o:odrzan_kurs)-[:ima_post]-(post) where id(o) = {id} return id(o) as id, post.tip as tip, post.name as naslov, post.putanja as putanja, post.tekst as tekst, post.ind as indikator, post.vreme as vreme";
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

        [Route("postovi/obavestenja")]
        [HttpPost]
        public IActionResult NovoObavestenje([FromBody] JObject jsonBody)
        {
            var obavestenje = JsonConvert.DeserializeObject<NotificationPost>(jsonBody.ToString(), 
                                new JsonSerializerSettings()
                                    { MissingMemberHandling = MissingMemberHandling.Ignore }
                                );
            obavestenje.SaveToDB();
            return Created("lokacija", "radi");
        }

    }
}


