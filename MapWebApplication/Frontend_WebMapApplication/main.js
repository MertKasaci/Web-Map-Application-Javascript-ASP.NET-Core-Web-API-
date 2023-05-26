//Global Variables
let map;
let drawings = [];

//This function initalize the map.
function initializeMap() {
    map = new ol.Map({

        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([35.1686, 39.9334]), //Coordinates Of Turkey
            zoom: 7
        })

    }
    )
}

//Enable drawing interaction 
function enableDrawingInteraction() {
    const draw = new ol.interaction.Draw({
        source: new ol.source.Vector(),
        type: 'LineString'
    });

    map.addInteraction(draw);
    draw.on('drawend', function (event) {
        const feature = event.feature;
        const coordinates = feature.getGeometry().getCoordinates();
        //console.log(coordinates); //put it the control understand that 415 status code problem is about coordinates variable

        //Open the modal-popup window to capture name and number
        openModalPopup(coordinates);
    });
}

//Open the modal-popup window
function openModalPopup(coordinates) {
    const modal = jsPanel.create({
        theme: 'dark',
        headerTitle: 'Add Drawing',
        position: 'center-top',
        panelSize: '450 300',
        contentSize: '400 200',
        content:`
               
                  <div class="mb-3">
                    <label style="color:white" for="name" class="form-label">Name:</label>
                    <input  type="text" id="name" class="form-control" placeholder="Enter name" ">
                  </div>
                  <div class="mb-3">
                    <label style="color:white" for="number" class="form-label">Number:</label>
                    <input type="text" id="number" class="form-control" placeholder="Enter number">
                  </div>
                  <button type="button" id="saveDrawingBtn" style="margin-top: 10px;">Save Drawing</button>
                
               `
    });

    const saveDrawingBtn = document.getElementById('saveDrawingBtn');
    saveDrawingBtn.addEventListener('click', function () {
        const name = document.getElementById('name').value;
        const number = document.getElementById('number').value;

        //Save the drawing with entered data and coordinates
        saveDrawing(name, number, coordinates);

        //Close the modal-popup window
        modal.close();
    });
}



//Save the drawing
function saveDrawing(name, number, coordinates) {
    const data = {
        name: name,
        number: number,
        coordinates: coordinates
    };

    //Make an API request to the backend to save the drawing
    fetch('https://localhost:44303/api/Drawing' , {
        method: 'POST',
        header: {
            //'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            //Handle the response from the backend
            console.log(result);
        })
        .catch(error => {
            //Handle any errors that occurred during the request
            console.error('Error:', error);
        });

}

//Query the drawings
function queryDrawings() {
    //Make an API request to the backend to retrieve the drawings
    fetch('https://localhost:44303/api/Drawing')
        .then(response => response.json())
        .then(data => {
            //Handle the retrieved drawings 
            drawing = data;

            //Display the retrieved drawings in a datatable
            displayDrawingsTable();

            //Display the retrieved drawings on the map 
            displayDrawingsOnMap();
        })
        .catch(error => {
            //Handle any errors that occurred during the request 
            console.error('Error:', error);
        });
}





//Display the retrieved drawings in a datatable
function displayDrawingsTable() {
    const tableData = drawings.map(drawing => {
        return [drawing.name, drawing.number];
    });

    $('#drawingTable').DataTable({
        data: tableData,
        columns: [
            { title: 'Name' },
            { title: 'Number' }
        ]
    });
}

//Display the retrieved drawings on the map
function displayDrawingsOnMap() {
    const vectorSource = new ol.source.Vector();

    drawings.forEach(drawing => {
        const coordinates = drawing.coordinates;
        const feature = new ol.Feature({
            geometry: new ol.geom.LineString(coordinates)
        });
        vectorSource.addFeatures(feature);
    });
    const vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });
    map.addLayer(vectorLayer);
}





//This function initializeApp
function initializeApp() {
    initializeMap();

    const addDrawingBtn = document.getElementById('addDrawingBtn');
    const queryDrawingBtn = document.getElementById('queryDrawingBtn');

    addDrawingBtn.addEventListener('click', function () {
        enableDrawingInteraction();
    });

    queryDrawingBtn.addEventListener('click', function () {
        queryDrawings();
    });
}

//Below line execute the app initialization after the page has loaded
document.addEventListener('DOMContentLoaded', initializeApp());

