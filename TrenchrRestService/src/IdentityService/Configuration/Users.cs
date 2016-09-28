using IdentityModel;
using IdentityServer3.Core;
using IdentityServer3.Core.Services.InMemory;
using System.Collections.Generic;
using System.Security.Claims;


namespace IdentityService.Configuration
{
    public class Users
    {
        public static List<InMemoryUser> Get()
        {
            var users = new List<InMemoryUser>();
            var stmnt = "match (s:student) return id(s) as subject, s.name as name, s.ime as given_name, s.prezime as family_name, " +
                                                " s.email as email, s._password as password , s._claimRoles as roles";

            var result = Neo4jClient.Execute(stmnt);
            foreach (var row in result)
            {
                var user = new InMemoryUser
                {
                    Subject = ((long)row["subject"]).ToString(),
                    Username = (string)row["email"],
                    Password = (string)row["password"]
                };

                var claims = new List<Claim>
                {
                    new Claim(Constants.ClaimTypes.Name, (string)row["name"]),
                    new Claim(Constants.ClaimTypes.GivenName, (string)row["given_name"]),
                    new Claim(Constants.ClaimTypes.FamilyName,(string)row["family_name"] ),
                    new Claim(Constants.ClaimTypes.Email, (string)row["email"])
                };

                string temp = row["roles"].ToString();
                string[] roles = temp.Substring(1, temp.Length-2).Split(',');
                foreach (var role in roles)
                    claims.Add(new Claim(Constants.ClaimTypes.Role, role));

                user.Claims = claims;
                users.Add(user);
            }

            return users;
        }
    }
}
