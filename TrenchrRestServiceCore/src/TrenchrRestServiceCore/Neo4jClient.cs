using Neo4j.Driver.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrenchrRestServiceCore
{
    public static class Neo4jClient
    {
        public static IStatementResult Execute(string statement)
        {
            IStatementResult result = null;
            using (var driver = GraphDatabase.Driver("bolt://localhost", AuthTokens.Basic("neo4j", "neo4j")))
            using (var session = driver.Session())
            {
                result = session.Run(statement);
            }
            return result;
        }

        public static Task<IStatementResult> ExecuteAsync(string statement)
        {
            return Task.Run<IStatementResult>(() =>
            {
                return Execute(statement);
            });
        }
    }
}
