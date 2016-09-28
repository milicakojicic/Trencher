
using IdentityServer3.Core.Models;
using System.Collections.Generic;

namespace IdentityService.Configuration
{
    public class Clients
    {
        public static List<Client> Get()
        {
            return new List<Client>
            {
                new Client
                {
                    ClientName = "Test Client",
                    ClientId = "test",
                    ClientSecrets = new List<Secret>
                    {
                        new Secret("secret".Sha256())
                    },

                    // server to server communication
                    Flow = Flows.ClientCredentials,

                    // only allowed to access api1
                    AllowedScopes = new List<string>
                    {
                        "api1"
                    }
                },

                new Client
                {
                    ClientId = "js",
                    ClientName = "JavaScript Client",
                    Flow = Flows.Implicit,
                    AllowAccessTokensViaBrowser = true,

                    RedirectUris = new List<string>
                    {
                        "http://localhost:4033/callback.html"
                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        "http://localhost:4033/default.html"
                    },
                    AllowedCorsOrigins = new List<string>
                    {
                        "http://localhost:4033"
                    },

                    AllowedScopes = new List<string>
                    {
                        StandardScopes.OpenId.Name,
                        StandardScopes.Profile.Name,
                        "api1"
                    }
                }
            };
        }
    }
}
