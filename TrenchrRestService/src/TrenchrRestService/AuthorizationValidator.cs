using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService
{
    public static class AuthorizationValidator
    {
        public static bool isAuthorized(HttpContext context, long user_id)
        {
            string subject = context.User.Claims.Where(x => x.Type == "sub").FirstOrDefault()?.Value.ToString();
            if (subject != user_id.ToString())
                return false;

            return true;
        }
    }
}
