using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityService.Models;

namespace IdentityService.Services
{
    public class Neo4jRepository : IRepository
    {
        public Neo4jDbUser GetUserById(long id)
        {
            throw new NotImplementedException();
        }

        public Neo4jDbUser GetUserByUsername(string username)
        {
            throw new NotImplementedException();
        }
    }
}
