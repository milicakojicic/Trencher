using IdentityServer3.Core.Models;
using System.Collections.Generic;

namespace IdentityService.Configuration
{
    public class Scopes
    {
        public static IEnumerable<Scope> Get()
        {
            return new[]
            {
                // standard OpenID Connect scopes
                StandardScopes.OpenId,
                StandardScopes.ProfileAlwaysInclude,
                StandardScopes.OfflineAccess,
                StandardScopes.EmailAlwaysInclude,

                // API - access token will 
                // contain roles of user
                new Scope
                {
                    Name = "api1",
                    DisplayName = "API 1",
                    Type = ScopeType.Resource,

                    Claims = new List<ScopeClaim>
                    {
                        new ScopeClaim("role")
                    }
                }
            };
        }
    }
}