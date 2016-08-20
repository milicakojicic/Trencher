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
    [Route("/")]
    public class DefaultController : ApiController
    {
        [HttpGet]
        public IActionResult GetAllPosts()
        {
            var list = new List<Post>()
            {
                new Post() { Title = "Vazno!!! RS2", Content = "Moramo autentifikaciju i autoriziju da resimo" },
                new Post() { Title = "KIA2 Vezbe", Content = "Nemamo vezbe prve nedelje" }
            };

            string json = JsonConvert.SerializeObject(list, Formatting.Indented);

            return Ok(json);
        }

        [Route("posts")]
        [HttpGet]
        public IActionResult GetPosts()
        {

            return Ok("radi");
        }

        [Route("posts/{id}")]
        [HttpGet]
        public IActionResult GetPost(int id)
        {
            var post = new Post() { Title = "Vazno!!! RS2", Content = "Moramo autentifikaciju i autoriziju da resimo" };
            var json = JsonConvert.SerializeObject(post);
            return Ok(json);
        }


        [Route("profile")]
        [HttpGet]
        public IActionResult GetProfile()
        {

            return Ok("radi");
        }

        [Route("subjects")]
        [HttpGet]
        public IActionResult GetSubjects()
        {

            return Ok("radi");
        }
    }
}
