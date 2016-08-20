using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using TrenchrRestServiceCore.Models;

namespace TrenchrRestServiceCore.Controllers
{
    [Route("faculties")]
    public class FacultyController : ApiController
    {
        [HttpGet]
        public IActionResult GetAllFaculties()
        {
            var stmnt = "MATCH (f:fakutet) return id(f) as id, f.Name as name, f.University as univercity, f.City as city";
            var resultFaculties = Neo4jClient.Execute(stmnt);
            var faculties = new List<Faculty>();
            foreach (var f in resultFaculties)
                faculties.Add(new Faculty()
                {
                    ID = (long)f["id"],
                    Name = (string)f["name"],
                    City = (string)f["city"],
                    University= (string)f["university"]
                });
            
            return Ok();
        }
    }
}
