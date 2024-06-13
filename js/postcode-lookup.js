let map;
let marker;

$(document).ready(function() {

    // Initialize the map - https://leafletjs.com/
    map = L.map('map').setView([54.86691398684093, -6.258241527628078], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    marker = L.marker([54.86691398684093, -6.258241527628078]).addTo(map);

    $('#postcodeLookup').submit(function(event) {
        event.preventDefault();
        const postcode = $('#postcode').val();

        // Validation for the postcode textbox
        if (postcode.length > 7) {
            displayError('A UK postcode does not exceed 7 characters');
            return;
        }

        $.ajax({
            url: `https://api.postcodes.io/postcodes/${postcode}`, //endpoint callback for the Postcodes.IO API
            method: 'GET',
            success: function(data) {
                if (data.status === 200) {
                    displayResults(data.result);
                    updateMap(data.result.latitude, data.result.longitude);
                } else {
                    displayError(data.error);
                }
            },
            error: function() {
                displayError('An error occurred. Please try again.');
            }
        });
    });

    // Display results 
    function displayResults(result) {
        const resultsDiv = $('#results');
        resultsDiv.html(`
            <h2>Results for: ${result.postcode}</h2>
            <p><strong>Country:</strong> ${result.country}</p>
            <p><strong>Region:</strong> ${result.region}</p>
            <p><strong>District:</strong> ${result.admin_district}</p>
            <p><strong>Latitude:</strong> ${result.latitude}</p>
            <p><strong>Longitude:</strong> ${result.longitude}</p>
        `);
        $('#map').show(); // Show the map div after a sucess for postcode results
    }

    // An error message if the returning an invalid postcode
    function displayError(message) {
        const resultsDiv = $('#results');
        resultsDiv.html(`<p style="color: red;">${message}</p>`);
    }

    // Update location for the map from results above
    function updateMap(lat, lng) {
        const location = [lat, lng];
        map.setView(location, 13);
        marker.setLatLng(location);
    }

});