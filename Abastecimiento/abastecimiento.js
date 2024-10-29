let map = L.map('map').setView([19.27,-99.68],8)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 30,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

document.getElementById('Seleccionar').addEventListener('change',function(e){
    let coords = e.target.value.split(",");
    map.flyTo(coords,13);
})

var carto = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap, Carto'
})

var minimap = new L.control.minimap(carto,
    {
        toggleDisplay: true,
        minimized: false,
        position: 'bottomleft'
    }).addTo(map);

new L.control.scale({imperial: false}).addTo(map);

//Agregar Geojson
L.geoJSON(agua).addTo(map);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};
//actualizacion del control segun puntero
info.update = function (props) {
    this._div.innerHTML = '<h4> Nombre del Municipio </h4>' +  
        (props ? '<b>' + props.NOMUT + '</b><br />' + ' Fuente de Abastecimiento: </sup>' + props.FUENTESUM + ' Horario de Abastecimiento: </sup>' + props.HSUMINIST
        : 'Acerque el puntero a una zona');
};

info.addTo(map);


//simbologia
function getColor(d){
    return d < 1 ? '#69b2ff':
           d < 2 ? '#69f3ff':
           d < 3  ? '#30123b':
           d < 4  ? '#9369ff':
           d < 5  ? '#fb3021':
           d < 6  ? '#77ff5f':
           d < 7  ? '#da69ff':
           d < 8  ? '#ffff69':
           d < 9  ? '#ffb769':
                     '#ffffff';
}

//Mostrando la simbologia
function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.Fuente)
    };
}
//interaccion de puntero
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    info.update(layer.feature.properties);
}
//Resaltado
var aguajs;

function resetHighlight(e) {
    aguajs.resetStyle(e.target);
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}

//formato geojson
var aguajs = L.geoJSON(agua,{
    style : style,
    onEachFeature: onEachFeature
}).addTo(map);