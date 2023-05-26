using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Backend_WebMapApplication.Models
{
    public class DrawingModel
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("number")]
        public int Number { get; set; }

        [JsonPropertyName("coordinates")]
        public List<double[]> Coordinates { get; set; }
    }
}
