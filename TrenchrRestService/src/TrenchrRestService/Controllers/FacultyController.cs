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
    [Route("faculties")]
    public class FacultyController : ApiController
    {
        [HttpGet]
        public IActionResult GetAllFaculties()
        {
            var stmnt = "MATCH (f:fakultet) return id(f) as id, f.Name as name, f.University as university, f.City as city";
            var resultFaculties = Neo4jClient.Execute(stmnt);
            var faculties = new List<Faculty>();
            foreach (var f in resultFaculties)
                faculties.Add(new Faculty(f));
            
            return Ok(JsonConvert.SerializeObject(faculties, Formatting.Indented));
        }
    }
}
