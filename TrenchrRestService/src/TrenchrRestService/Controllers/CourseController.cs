using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using TrenchrRestService.Models;

namespace TrenchrRestService.Controllers
{
    public class CourseController : ApiController
    {
        //svi kursevi
        [Route("kursevi_neodrzani")]
        [HttpGet]
        public IActionResult VratiSveKurseve()
        {
            var stmnt = "match(f: fakultet)-[:ima_smer]->(s:smer)-[:sadrzi_kurs]->(k: kurs) return f.name as fakultet, s.name as smer, k.name as name, id(k) as id, k.espb as espb, k.opis as opis";
            var resultCourses = Neo4jClient.Execute(stmnt);
            var courses = new List<Course>();
            foreach (var o in resultCourses)
                courses.Add(new Course(o));

            return Ok(JsonConvert.SerializeObject(courses, Formatting.Indented));
        }
    }
}
