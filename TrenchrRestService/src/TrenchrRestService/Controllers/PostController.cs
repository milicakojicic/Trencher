using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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
        //TODO promeni rutu
        //postovi koji pripadaju nekom predmetu
        [Route("postovi/{id}")]
        [HttpGet]
        public IActionResult GetAllMaterials(long id)
        {
            var stmnt = $"MATCH (o:odrzan_kurs)-[:ima_post]-(post), (korisnik)-[:objavio]-(post) where id(o) = {id} return id(o) as kurs_id, id(post) as id, post.tip as tip, post.name as naslov, post.putanja as putanja, post.tekst as tekst, post.ind as indikator, post.vreme as vreme, id(korisnik) as korisnik_id, korisnik.name as ime_korisnika, korisnik.putanja as putanja_korisnika";
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
            var obavestenje = JsonConvert.DeserializeObject<NotificationPost>(jsonBody.ToString(), new JsonSerializerSettings() { MissingMemberHandling = MissingMemberHandling.Ignore });
            obavestenje.SaveToDBNotification();
            return Created("lokacija", "radi");
        }

        [Route("postovi/materijali")]
        [HttpPost]
        public IActionResult NoviMaterijali([FromBody] JObject jsonBody)
        {
            var materijali = JsonConvert.DeserializeObject<Material>(jsonBody.ToString(), new JsonSerializerSettings() { MissingMemberHandling = MissingMemberHandling.Ignore });
            materijali.SacuvajMaterijale();
            return Created("lokacija", "radi");
        }

        [Route("postovi/rezultati")]
        [HttpPost]
        public IActionResult NoviRezultati([FromBody] JObject jsonBody)
        {
            var rezultati = JsonConvert.DeserializeObject<Results>(jsonBody.ToString(), new JsonSerializerSettings() { MissingMemberHandling = MissingMemberHandling.Ignore });
            rezultati.SacuvajRezultate();
            return Created("lokacija", "radi");
        }

        //pravljenje glasanja
        [Route("postovi/glasanje")]
        [HttpPost]
        public IActionResult NovoGlasanje([FromBody] JObject jsonBody)
        {
            var glasanje = JsonConvert.DeserializeObject<Vote>(jsonBody.ToString(), new JsonSerializerSettings() { MissingMemberHandling = MissingMemberHandling.Ignore });
            var id = glasanje.SacuvajGlasanje();
            string jsonString = JsonConvert.SerializeObject(id);
            return Created("lokacija", jsonString);
        }

        //pravljenje nove opcije glasanja
        [Route("postovi/glasanje/opcija")]
        [HttpPost]
        public IActionResult NovaOpcija([FromBody] JObject jsonBody)
        {
            var opcija = JsonConvert.DeserializeObject<VoteOption>(jsonBody.ToString(), new JsonSerializerSettings() { MissingMemberHandling = MissingMemberHandling.Ignore });
            opcija.SacuvajOpcijuGlasanja();
            return Created("lokacija", "radi");
        }


        //pravljenje komentara za dati post
        [Route("postovi/komentari")]
        [HttpPost]
        public IActionResult NapraviKomentar([FromBody] JObject jsonBody)
        {
            var komentar = JsonConvert.DeserializeObject<Comment>(jsonBody.ToString(), new JsonSerializerSettings() { MissingMemberHandling = MissingMemberHandling.Ignore });
            komentar.SacuvajKomentar();
            return Created("lokacija", "radi");
        }

        //vracanje komentara nekog posta
        [Route("postovi/{id}/komentari")]
        [HttpGet]
        public IActionResult VratiKomentare(long id)
        {
            var stmnt = $"match (s:student)-[:komentarisao]->(k:komentar)-[:u_postu]->(post) where id(post) = {id} return id(k) as id, id(post) as parent_id, k.vreme as vreme, k.tekst as tekst, id(s) as user_id, s.ime as ime, s.prezime as prezime";
            var rezKomentari = Neo4jClient.Execute(stmnt);
            var komentari = new List<Comment>();
            foreach (var o in rezKomentari)
                komentari.Add(new Comment(o));

            return Ok(JsonConvert.SerializeObject(komentari, Formatting.Indented));
        }


        //najskoriji postovi za predmete ciji je ulogovani korisnik clan
        [Route("student/{id}/predmeti/postovi")]
        [HttpGet]
        public IActionResult VratiPostoveZaHome(long id)
        {
            var stmnt = $"match (s:student)-[:pohadja]->(o:odrzan_kurs)-[:ima_post]->(post)-[:objavio]->(neko) where id(s) = {id} return id(o) as kurs_id, id(post) as id, post.tip as tip, post.name as naslov, post.putanja as putanja, post.tekst as tekst, post.ind as indikator, post.vreme as vreme, id(s) as korisnik_id, s.name as ime_korisnika, s.putanja as putanja_korisnika";
            var resultPosts = Neo4jClient.Execute(stmnt);

            //mozda nam nekad bude trebalo
            var materials = new List<Material>();
            var results = new List<Results>();
            var votes = new List<Vote>();
            var notifications = new List<NotificationPost>();

            //lista postova koji se vracaju
            var posts = new List<Post>();

            foreach (var o in resultPosts)
            {

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

    }
}


