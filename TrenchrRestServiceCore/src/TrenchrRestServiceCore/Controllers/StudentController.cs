using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace TrenchrRestServiceCore.Controllers
{
    [Route("posts")]
    public class StudentController : ApiController
    {
        [HttpGet]
        public IActionResult GetAllStudents()
        {
            return Ok();
        }
    }
}
