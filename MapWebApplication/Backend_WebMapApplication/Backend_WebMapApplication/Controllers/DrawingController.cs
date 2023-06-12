using Backend_WebMapApplication.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;

namespace Backend_WebMapApplication.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    
    public class DrawingController : ControllerBase
    {
        private readonly string _filePath = Path.Combine("Models", "mapData.json");


        //POST:api/drawing
        [HttpPost]
        public IActionResult saveMapData([FromBody] DrawingModel model)
        {
            if (model == null)
                return BadRequest();

            

            // Save the drawing to the JSON file
            string jsonData = JsonConvert.SerializeObject(model);
            System.IO.File.WriteAllText(_filePath, jsonData);

            // Return a response
            return Ok(new { message = "Drawing added successfully." });
        }

        //GET:api/drawing 
        [HttpGet]
        public IActionResult getMapData()
        {
            if (!System.IO.File.Exists(_filePath))
                return NotFound();

            //Read the JSON data from the file
            string jsonData = System.IO.File.ReadAllText(_filePath);

           //Deserialize the JSON data 
            var drawings = JsonConvert.DeserializeObject(jsonData);

            //Return the retrieved drawings
            return Ok(drawings);
        }


    }
}
