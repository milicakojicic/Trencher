using IdentityService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityService.Services
{
    public interface IRepository
    {
        Neo4jDbUser GetUserByUsername(string username);
        Neo4jDbUser GetUserById(long id);
        bool ValidatePassword(string username, string plainTextPassword);
        Neo4jDbClient GetClient(string clientId);
    }
}
