using System.Collections.Generic;
using IdentityServer3.Core.Models;

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
                    ClientName = "MVC6 Demo Client",
                    ClientId = "mvc6",

                    Flow = Flows.Implicit,

                    RedirectUris = new List<string>
                    {
                        "http://localhost:9090/signin-oidc",
                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        "http://localhost:9090/",
                    },

                    // access to identity data and api1
                    AllowedScopes = new List<string>
                    {
                        "openid",
                        "email",
                        "profile",
                        "api1"
                    }
                },
                new Client
                {
                    ClientId = "esmifavorito",
                    ClientName = "esmifavorito-client",
                    Enabled = true,
                    ClientSecrets = new List<Secret>
                    {
                        new Secret("esmifavorito".Sha256()) //PQ/pIgjXnBfK67kOxGxz9Eykft6CKPkPewR3jUNEkZo=
                    },

                    Flow = Flows.ResourceOwner,

                    //RequireConsent = false,
                    //AllowRememberConsent = false,
                    //ClientUri = "http",
                    RedirectUris = new List<string>
                    {
                        "https://localhost:44304",
                    },

                  

                    AllowedCorsOrigins = new List<string>
                    {
                        "https://localhost:44304",
                        "http://localhost:50655",
                        "chrome-extension://fdmmgilgnpjigdojojpjoooidkmcomcm",
                        "*",
                    },

                    PostLogoutRedirectUris = new List<string>
                    {
                        "https://localhost:44304",
                    },

                    AccessTokenType = AccessTokenType.Jwt,
                    IdentityTokenLifetime = 3000,
                    AccessTokenLifetime = 3600,
                    AuthorizationCodeLifetime = 300
                }
            };
        }
    }
}