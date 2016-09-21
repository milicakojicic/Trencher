using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService
{
    public static class Neo4jClient
    {
        public class Query
        {
            [JsonProperty(PropertyName = "statement")]
            public string Statment { get; set; }

            [JsonProperty(PropertyName = "parameters")]
            public JObject Parameters { get; set; }

            [JsonProperty(PropertyName = "includeStats")]
            public bool IncludeStats { get; set; }
            
            [JsonProperty(PropertyName = "resultDataContents")]
            public JArray ResultDataContents { get; set; }
        }

        public class Statements
        {
            [JsonProperty(PropertyName = "statements")]
            public List<Query> StatementsList { get; set; }
        }

        public class Stats
        {
            [JsonProperty(PropertyName = "contains_updates")]
            public bool ContainsUpdates { get; set; }

            [JsonProperty(PropertyName = "nodes_created")]
            public long NodesCreated { get; set; }

            [JsonProperty(PropertyName = "nodes_deleted")]
            public long NodesDeleted { get; set; }

            [JsonProperty(PropertyName = "properties_set")]
            public long PropertiesSet { get; set; }

            [JsonProperty(PropertyName = "relationships_created")]
            public long RelationshipsCreated { get; set; }

            [JsonProperty(PropertyName = "relationship_deleted")]
            public long RelationshipDeleted { get; set; }

            [JsonProperty(PropertyName = "labels_added")]
            public long LabelsAdded { get; set; }

            [JsonProperty(PropertyName = "labels_removed")]
            public long LabelsRemoved { get; set; }

            [JsonProperty(PropertyName = "indexes_added")]
            public long IndexesAdded { get; set; }

            [JsonProperty(PropertyName = "indexes_removed")]
            public long IndexesRemoved { get; set; }

            [JsonProperty(PropertyName = "constraints_added")]
            public long ConstraintsAdded { get; set; }

            [JsonProperty(PropertyName = "constraints_removed")]
            public long ConstraintsRemoved { get; set; }
        }

        public class ResultElement
        {
            [JsonProperty(PropertyName = "columns")] 
            public List<string> Columns { get; set; }

            [JsonProperty(PropertyName = "data")]
            public JArray Data {get; set;}

            [JsonProperty(PropertyName = "stats")]
            public Stats Stats { get; set; }

        }

        public class StatementsResults
        {
            [JsonProperty(PropertyName = "results")]
            public List<ResultElement> Results { get; set; }

            [JsonProperty(PropertyName = "errors")]
            public JArray Errors { get; set; }
            
        }

        public static Task<dynamic> ExecuteAsync(Statements stmnts)
        {   
            return Task.Run<dynamic>(() =>
            {
                var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", "bmVvNGo6cGFzc3dvcmQ=");

                var jsonString = JsonConvert.SerializeObject(stmnts, 
                    new JsonSerializerSettings() { NullValueHandling = NullValueHandling.Ignore });
                var content = new StringContent(jsonString, Encoding.UTF8, "application/json");

                //TO DO : ubaciti  u konfiguraciju URL
                var url = "http://localhost:7474/db/data/transaction/commit";
                var response = httpClient.PostAsync(url, content).Result;
                response.EnsureSuccessStatusCode();
                return JsonConvert.DeserializeObject( response.Content.ReadAsStringAsync().Result);
            });           
        }

        public static StatementsResults Execute(Statements stmnts)
        {
            var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", "bmVvNGo6cGFzc3dvcmQ=");

            var jsonString = JsonConvert.SerializeObject(stmnts,
            new JsonSerializerSettings() { NullValueHandling = NullValueHandling.Ignore });
            var content = new StringContent(jsonString, Encoding.UTF8, "application/json");

            //TO DO : ubaciti  u konfiguraciju URL
            var url = "http://localhost:7474/db/data/transaction/commit";
            var response = httpClient.PostAsync(url, content).Result;
            response.EnsureSuccessStatusCode();
            var result =  JsonConvert.DeserializeObject<StatementsResults>(response.Content.ReadAsStringAsync().Result);
            if (result.Errors.Count > 0)
                throw new Exception($"Neo4j : There is some errors in statments \n { JsonConvert.SerializeObject(result.Errors)}");
            return result;           
        }
    }
}
