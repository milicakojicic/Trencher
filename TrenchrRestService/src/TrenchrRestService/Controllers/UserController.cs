using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using TrenchrRestService;
using TrenchrRestService.Models;

namespace TrenchrRestService.Controllers
{
    //[Authorize]
    public class UserController : ApiController
    {
        //uzimanje podataka o svim studenata
        [Route("studenti")]
        [HttpGet]
        public IActionResult GetAllStudents()
        {
            var stmnt = "MATCH (s:student)-[:na_fakultetu]-(fakultet),(s:student)-[:na_smeru]-(smer)  return id(s) as id, s.ime as ime, s.prezime as prezime, s.generacija as generacija, s.email as email, s.indeks as indeks, s.putanja as slika, fakultet.name as fakultet, fakultet.university as univerzitet, smer.name as smer";
            var resultStudents = Neo4jClient.Execute(stmnt);
            var students = new List<Student>();
            foreach (var s in resultStudents)
                students.Add(new Student(s));

            return Ok(JsonConvert.SerializeObject(students, Formatting.Indented));
        }

        //uzimanje podataka o pojedinacnom studentu
        [Route("studenti/{id}")]
        [HttpGet]
        public IActionResult GetStudent(long id)
        {
            var stmnt = $"MATCH (s:student)-[:na_fakultetu]-(fakultet),(s:student)-[:na_smeru]-(smer) where id(s) = {id} return id(s) as id, s.ime as ime, s.prezime as prezime, s.generacija as generacija, s.email as email, s.indeks as indeks, s.putanja as slika, fakultet.name as fakultet, fakultet.university as univerzitet, smer.name as smer";
            var resultStudents = Neo4jClient.Execute(stmnt);
            var student = new Student(resultStudents.FirstOrDefault());

            return Ok(JsonConvert.SerializeObject(student, Formatting.Indented));
        }

        //za prikaz u post-u
        [Route("korisnici/{id}")]
        [HttpGet]
        public IActionResult vratiKorisnika(long id)
        {
            var stmnt = $"MATCH (a) where id(a) = {id} return id(a) as id, a.email as email, a.ime as ime, a.prezime as prezime, a.putanja as slika, labels(a) as oznaka";
            var resultUser = Neo4jClient.Execute(stmnt);
            var user = resultUser.FirstOrDefault();

            var o = user["oznaka"].ToString();

            if (o == "student")
            {
                var student = new Student(user);
                return Ok(JsonConvert.SerializeObject(student, Formatting.Indented));
            }

            else if (o == "asistent")
            {
                var asistent = new Assistant(user);
                return Ok(JsonConvert.SerializeObject(asistent, Formatting.Indented));
            }

            else
            {
                var profesor = new Professor(user);
                return Ok(JsonConvert.SerializeObject(profesor, Formatting.Indented));
            }
        }

        [Route("korisnici/{id}/slika")]
        [HttpPut]
        public IActionResult updatePicture([FromBody] JObject jsonBody, long id)
        {
            dynamic param = jsonBody;
            string putanja = param.picture_path;
            string stmnt = $"MATCH (u) SET u.putanja = {putanja} WHERE id(u) = {id}";
            Neo4jClient.Execute(stmnt);
            return Ok();
        }

        [Route("korisnici/{id}")]
        [HttpPut]
        public IActionResult updateUser([FromBody] JObject jsonBody, long id)
        {
            var stmnt = new StringBuilder($"MATCH (u) WHERE id(u) = {id} SET ");
            var updatedProperties = jsonBody.Properties();
            var property = updatedProperties.First();
           
            appendProperty(property, stmnt);
            while (property.Next != null)
            {
                stmnt.Append(", ");
                property = (JProperty)property.Next;
                appendProperty(property, stmnt);
            }
            
            Neo4jClient.Execute(stmnt.ToString());
            return Ok();
        }

        private void appendProperty(JProperty property, StringBuilder builder)
        {
            if (property.Value.Type == JTokenType.String)
                builder.Append($"u.{property.Name} = '{property.Value}' ");
            else
                builder.Append($"u.{property.Name} = {property.Value} ");
        }
    }
}
