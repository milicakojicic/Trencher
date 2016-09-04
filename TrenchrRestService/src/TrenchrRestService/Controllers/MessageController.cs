using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using TrenchrRestService.Models;

namespace TrenchrRestService.Controllers
{
    public class MessageController : ApiController
    {
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

        //pravljenje komentara za dati post
        [Route("konverzacije/{id}/poruke")]
        [HttpPost]
        public IActionResult NapisiPoruku([FromBody] JObject jsonBody)
        {
            var poruka = JsonConvert.DeserializeObject<Message>(jsonBody.ToString(), new JsonSerializerSettings() { MissingMemberHandling = MissingMemberHandling.Ignore });
            poruka.SacuvajPoruku();
            return Created("lokacija", "radi");
        }
    }
}
