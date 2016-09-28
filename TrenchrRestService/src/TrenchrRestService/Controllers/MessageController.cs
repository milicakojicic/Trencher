using Microsoft.AspNet.SignalR;
using Microsoft.AspNetCore.Mvc;
using Neo4j.Driver.V1;
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
        [Route("korisnici/{id1}/konverzacije/{id2}")]
        [HttpGet]
        public IActionResult VratiKonverzaciju(long id1, long id2)
        {
            if (!AuthorizationValidator.isAuthorized(Context, id1))
                return new UnauthorizedResult();

            var stmnt1 = $"match (s1:student)-[:u_konverzaciji]->(k:konverzacija)<-[:u_konverzaciji]-(s2:student) where id(s1) = {id1} and id(s2) = {id2} return id(k) as id, k.ime as name";
            var rezKonverzacije1 = Neo4jClient.Execute(stmnt1);
            IRecord[] konverzacija1 = rezKonverzacije1.ToArray();
            string id_konverzacije = "";

            if (konverzacija1.Count() == 0)
            {
                var stmnt2 = $"match (s1:student), (s2:student) where id(s1) = {id1} and id(s2) = {id2} " + 
                              "with s1, s2 " + 
                              "create (k:konverzacija) " +
                              "create (s1)-[:u_konverzaciji]->(k) " +
                              "create (s2)-[:u_konverzaciji]->(k);";
                var rezKonverzacije2 = Neo4jClient.Execute(stmnt2);

                var stmnt3 = $"match (s1:student)-[:u_konverzaciji]->(k:konverzacija)<-[:u_konverzaciji]-(s2:student) where id(s1) = {id1} and id(s2) = {id2} return id(k) as id, k.ime as name";
                var rezKonverzacije3 = Neo4jClient.Execute(stmnt3);
                IRecord[] konverzacija3 = rezKonverzacije3.ToArray();
                id_konverzacije = konverzacija3[0]["id"].ToString();
            }
            else
                id_konverzacije = konverzacija1[0]["id"].ToString();

            return Ok(JsonConvert.SerializeObject(id_konverzacije, Formatting.Indented));
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
            var poruka = JsonConvert.DeserializeObject<Message>(jsonBody.ToString(), new JsonSerializerSettings() { MissingMemberHandling = MissingMemberHandling.Ignore });
            poruka.SacuvajPoruku();

            var stmnt = $"match (s:student) where id(s) = {poruka.UserID} return s.ime + ' ' + s.prezime as ime";
            var stmt_rez = Neo4jClient.Execute(stmnt);
            string posiljalacIme = "";

            foreach (var o in stmt_rez)
                posiljalacIme = o.Values.ElementAt(0).Value.ToString();

            // slanje SignalR signala da je napisana nova poruka
            var context = GlobalHost.ConnectionManager.GetHubContext<TrenchrHub>();
            context.Clients.All.newMessage(poruka.Text, poruka.UserID, posiljalacIme, poruka.ConversationID);

            return Created("lokacija", "radi");
        }
    }
}
