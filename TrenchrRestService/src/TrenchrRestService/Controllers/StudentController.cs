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
    public class StudentController : ApiController
    {

        [Route("studenti")]
        [HttpGet]
        public IActionResult GetAllStudents()
        {

            var stmnt = "MATCH (s:student) return id(s) as id, s.ime as ime, s.prezime as prezime, s.generacija as generacija, s.email as email, s.indeks as indeks, s.putanja as slika";
            var resultStudents = Neo4jClient.Execute(stmnt);
            var students = new List<Student>();
            foreach (var s in resultStudents)
                students.Add(new Student(s));

            return Ok(JsonConvert.SerializeObject(students, Formatting.Indented));
            
        }

        [Route("studenti/{id}")]
        [HttpGet]
        public IActionResult GetStudent(long id)
        {

            var stmnt = $"MATCH (s:student) where id(s)  = {id} return id(s) as id, s.ime as ime, s.prezime as prezime, s.generacija as generacija, s.email as email, s.indeks as indeks, s.putanja as slika";
            var resultStudents = Neo4jClient.Execute(stmnt);
            var student = new Student(resultStudents.FirstOrDefault());

            return Ok(JsonConvert.SerializeObject(student, Formatting.Indented));

        }
    }
}
