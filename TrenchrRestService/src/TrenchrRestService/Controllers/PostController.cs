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
            var id = komentar.SacuvajKomentar();
            string jsonString = JsonConvert.SerializeObject(id);
            return Created("lokacija", jsonString);
        }

        //vracanje komentara nekog posta
        [Route("postovi/{id}/komentari")]
        [HttpGet]
        public IActionResult VratiKomentare(long id)
        {
            var stmnt = $"match (s:student)-[:komentarisao]->(k:komentar)-[:u_postu]->(post) where id(post) = {id} return id(k) as id, id(post) as parent_id, k.vreme as vreme, k.tekst as tekst, id(s) as user_id, s.name as ime, s.putanja as putanja order by k.vreme asc";
            var rezKomentari = Neo4jClient.Execute(stmnt);
            var komentari = new List<Comment>();
            foreach (var o in rezKomentari)
                komentari.Add(new Comment(o));

            return Ok(JsonConvert.SerializeObject(komentari, Formatting.Indented));
        }

        //jedan odredjen komentar koji pripada nekom postu
        [Route("postovi/{id1}/komentari/{id2}")]
        [HttpGet]
        public IActionResult VratiKomentar(long id1, long id2)
        {
            var stmnt = $"match (s:student)-[:komentarisao]->(k:komentar)-[:u_postu]->(post) where id(post) = {id1} and id(k) = {id2} return id(k) as id, id(post) as parent_id, k.vreme as vreme, k.tekst as tekst, id(s) as user_id, s.name as ime, s.putanja as putanja order by k.vreme asc";
            var rezKomentari = Neo4jClient.Execute(stmnt);
            var komentari = new List<Comment>();
            foreach (var o in rezKomentari)
                komentari.Add(new Comment(o));

            return Ok(JsonConvert.SerializeObject(komentari, Formatting.Indented));
        }

        //najskoriji postovi za predmete ciji je ulogovani korisnik clan
        [Route("studenti/{id}/kursevi/postovi")]
        [HttpGet]
        public IActionResult VratiPostoveZaHome(long id)
        {
            //SVI postovi
            var stmnt = $"match (o:odrzan_kurs)-[:ima_post]->(post)<-[:objavio]-(neko) return id(o) as kurs_id, id(post) as id, "+ 
                        "post.tip as tip, post.name as naslov," + 
                        "post.putanja as putanja, post.tekst as tekst," +
                        "post.ind as indikator, post.vreme as vreme," +
                        "id(neko) as korisnik_id, neko.ime as ime_korisnika, neko.putanja as putanja_korisnika " +
                        "order by vreme desc limit 20";

            var resultPosts = Neo4jClient.Execute(stmnt);

            //mozda nam nekad bude trebalo
            var materials = new List<Material>();
            var results = new List<Results>();
            var votes = new List<Vote>();
            var notifications = new List<NotificationPost>();

            var posts = new List<Post>();

            //lista postova koji se vracaju
            var finalPosts = new List<Post>();

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

            //sad nam treba da su ti postovi bas u grupama koje korisnik prati
            //trebaju nam sve grupe korisnika 

            var stmnt1 = $"MATCH (s:student)-[:pohadja]-(o:odrzan_kurs) where id(s) = {id} return id(o) as id, o.name as name, o.espb as espb, o.tip as tip, o.nivo as nivo, o.godina as godina";
            var resultCourses = Neo4jClient.Execute(stmnt1);
            var courses = new List<HeldCourse>();
            foreach (var o in resultCourses)
                courses.Add(new HeldCourse(o));

            /* da li se id grupe tog korisnika nalazi u listi postova koji su vraceni (post u sebi ima polje kursa kome pripada),
            ako da  - onda ih ispisujemo */

            int i, j;

            for (i = 0; i < courses.ToArray().Length; i++) {
                for (j = 0; j < posts.ToArray().Length; j++) {
                    if (courses[i].ID == posts[j].KursID)
                        finalPosts.Add(posts[j]);
                }
            }

            return Ok(JsonConvert.SerializeObject(finalPosts, Formatting.Indented));
        }

        //vracanje opcija glasanja za dati post
        [Route("postovi/{id}/opcije")]
        [HttpGet]
        public IActionResult VratiOpcijeGlasanja(long id)
        {
            var stmnt = $"MATCH (o:opcija)-[:u_glasanju]->(g:glasanje) where id(g) = {id} return id(o) as id, id(g) as roditelj_id, o.tekst as text, o.brGlasova as broj_glasova";
            var rezOpcije = Neo4jClient.Execute(stmnt);
            var opcije = new List<VoteOption>();
            foreach (var o in rezOpcije)
                opcije.Add(new VoteOption(o));
            return Ok(JsonConvert.SerializeObject(opcije, Formatting.Indented));
        }


        //jedna odredjena opcija jednog odredjenog posta
        [Route("postovi/{id1}/opcije/{id2}")]
        [HttpGet]
        public IActionResult VratiOpcijeGlasanja(long id1, long id2)
        {
            var stmnt = $"MATCH (o:opcija)-[:u_glasanju]->(g:glasanje) where id(g) = {id1} and id(o) = {id2} return id(o) as id, id(g) as roditelj_id, o.tekst as text, o.brGlasova as broj_glasova";
            var rezOpcije = Neo4jClient.Execute(stmnt);
            var opcije = new List<VoteOption>();
            foreach (var o in rezOpcije)
                opcije.Add(new VoteOption(o));
            return Ok(JsonConvert.SerializeObject(opcije, Formatting.Indented));
        }


        [Route("opcije/{id}")]
        [HttpPut]
        public IActionResult updateOption([FromBody] JObject jsonBody, long id)
        {
          
            string stmnt = $"MATCH (u) WHERE id(u) = {id} SET u.brGlasova = u.brGlasova + 1";
            Neo4jClient.Execute(stmnt);
            return Ok();
        }


    }
}


