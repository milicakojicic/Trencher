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
    
    public class HeldCourseController : ApiController
    {
        

        //svi kursevi
        [Route("kursevi")]
        [HttpGet]
        public IActionResult VratiSveGrupe()
        {
            var stmnt = "MATCH (o:odrzan_kurs) return id(o) as id, o.name as name, o.espb as espb, o.tip as tip, o.nivo as nivo, o.godina as godina";
            var resultCourses = Neo4jClient.Execute(stmnt);
            var courses = new List<HeldCourse>();
            foreach (var o in resultCourses)
                courses.Add(new HeldCourse(o));

            return Ok(JsonConvert.SerializeObject(courses, Formatting.Indented));
        }


        //kursevi jedne osobe
        [Route("studenti/{id}/kursevi")]
        [HttpGet]
        public IActionResult VratiGrupeStudenta(long id)
        {
            var stmnt = $"MATCH (s:student)-[:pohadja]-(o:odrzan_kurs) where id(s) = {id} return id(o) as id, o.name as name, o.espb as espb, o.tip as tip, o.nivo as nivo, o.godina as godina";
            var resultCourses = Neo4jClient.Execute(stmnt);
            var courses = new List<HeldCourse>();
            foreach (var o in resultCourses)
                courses.Add(new HeldCourse(o));

            return Ok(JsonConvert.SerializeObject(courses, Formatting.Indented));
        }

        //jedan odredjen kurs
        [Route("kursevi/{id}")]
        [HttpGet]
        public IActionResult VratiOdredjenuGrupu(long id)
        {
            var stmnt = $"MATCH (o:odrzan_kurs) where id(o) = {id} return id(o) as id, o.name as name, o.espb as espb, o.tip as tip, o.nivo as nivo, o.godina as godina";
            var resultCourses = Neo4jClient.Execute(stmnt);
            var courses = new HeldCourse(resultCourses.FirstOrDefault());

            return Ok(JsonConvert.SerializeObject(courses, Formatting.Indented));
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


    }
}
