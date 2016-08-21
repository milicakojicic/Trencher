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
    [Route("students")]
    public class StudentController : ApiController
    {
        [HttpGet]
        public IActionResult GetAllStudents()
        {

            return Ok();
            
        }
    }
}
