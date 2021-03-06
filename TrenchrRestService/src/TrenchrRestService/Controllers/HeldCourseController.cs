﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using TrenchrRestService.Models;

namespace TrenchrRestService.Controllers
{
    [Authorize(Policy = "StudentPolicy")]
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
            if (!AuthorizationValidator.isAuthorized(Context, id))
                return new UnauthorizedResult();

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

        // prijavljivanje studenta na kurs
        [Route("kursevi/prijava")]
        [HttpPost]
        public IActionResult PrijaviStudentaNaKurs([FromBody] JObject jsonBody)
        {
            dynamic par = jsonBody;
            long id_korisnika = par.ID_korisnika;
            long id_grupe = par.ID_grupe;

            var stmnt = "match (ok:odrzan_kurs),(s:student) " + 
                        $"WHERE id(ok) = {id_grupe} and id(s) = {id_korisnika} WITH ok,s CREATE (s)-[:pohadja]->(ok) " ;

            var result = Neo4jClient.Execute(stmnt); 
            return Created("lokacija", "radi");
        }

        // prijavljivanje studenta na kurs
        [Route("kursevi/odjava")]
        [HttpPost]
        public IActionResult OdjaviStudentaSaKursa([FromBody] JObject jsonBody)
        {
            dynamic par = jsonBody;
            long id_korisnika = par.ID_korisnika;
            long id_grupe = par.ID_grupe;

            var stmnt = "match (ok:odrzan_kurs), (s:student) " +
                       $"WHERE id(ok) = {id_grupe} and id(s) = {id_korisnika} WITH ok,s match (s)-[r:pohadja]->(ok) delete r;";

            var result = Neo4jClient.Execute(stmnt);
            return Created("lokacija", "radi");
        }

        [Route("kursevi/novi_kurs")]
        [HttpPost]
        public IActionResult DodajKurs([FromBody] JObject jsonBody)
        {
            var kurs = JsonConvert.DeserializeObject<HeldCourse>(jsonBody.ToString(), new JsonSerializerSettings() { MissingMemberHandling = MissingMemberHandling.Ignore });
            kurs.SacuvajKurs();
            return Created("lokacija", "radi");
        }
    }
}
