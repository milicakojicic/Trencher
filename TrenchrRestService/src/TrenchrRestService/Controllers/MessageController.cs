using Microsoft.AspNet.SignalR;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using TrenchrRestService.Hubs;
using TrenchrRestService.Models;

namespace TrenchrRestService.Controllers
{
    public class MessageController : ApiController
    {
        //vracanje konverzacija korisnika
        [Route("korisnici/{id}/konverzacije")]
        [HttpGet]
        public IActionResult VratiKonverzacijeKorisnika(long id)
        {
            var stmnt1 = $"match (s:student)-[:u_konverzaciji]->(k:konverzacija) where id(s) = {id} return id(k) as id, k.ime as name";
            var rezKonverzacije = Neo4jClient.Execute(stmnt1);
            var konverzacije = new List<Conversation>();
            foreach (Conversation o1 in rezKonverzacije)
            {
                Conversation o = new Conversation();

                o.ID = o1.ID;
                o.Name = o1.Name;

                var stmnt2 = $"match (s:student)-[:u_konverzaciji]->(k:konverzacija) where id(k) = {o.ID} return id(s) as id, s.ime as name, s.prezime as surname, s.email as email, s.putanja as picture_path";
                var rezKorisnici = Neo4jClient.Execute(stmnt2);
                var korisnici = new HashSet<User>();
                foreach (var o2 in rezKorisnici)
                    korisnici.Add(new User(o2));

                o.Users = korisnici;

                var stmnt3 = $"match (k:konverzacija)-[:sadrzi_poruku]->(p:poruka) where id(k) = {id} return id(p) as id, p.poslao as user_id, p.vreme as vreme, p.tekst as tekst, id(k) as conversation_id";
                var rezPoruke = Neo4jClient.Execute(stmnt3);
                var poruke = new List<Message>();
                foreach (var o3 in rezPoruke)
                    poruke.Add(new Message(o3));

                o.Messages = poruke;

                konverzacije.Add(o);
            }

            return Ok(JsonConvert.SerializeObject(konverzacije, Formatting.Indented));
        }

        //vracanje poruka neke konverzacije
        [Route("konverzacije/{id}")]
        [HttpGet]
        public IActionResult VratiPorukeKonverzacije(long id)
        {
            var stmnt = $"match (k:konverzacija)-[:sadrzi_poruku]->(p:poruka) where id(k) = {id} return id(p) as id, p.poslao as user_id, p.vreme as vreme, p.tekst as tekst, id(k) as conversation_id";
            var rezPoruke = Neo4jClient.Execute(stmnt);
            var poruke = new List<Message>();
            foreach (var o in rezPoruke)
                poruke.Add(new Message(o));

            return Ok(JsonConvert.SerializeObject(poruke, Formatting.Indented));
        }

        //pisanje poruke
        [Route("konverzacije/{id}/poruke")]
        [HttpPost]
        public IActionResult NapisiPoruku([FromBody] JObject jsonBody)
        {
            // slanje SignalR signala da je napisana nova poruka
            NotificationHub.MessageCount++;
            var widgetHubContext = GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();
            widgetHubContext.Clients.All.updateMessageCount(NotificationHub.MessageCount);

            var poruka = JsonConvert.DeserializeObject<Message>(jsonBody.ToString(), new JsonSerializerSettings() { MissingMemberHandling = MissingMemberHandling.Ignore });
            poruka.SacuvajPoruku();
            return Created("lokacija", "radi");
        }
    }
}
