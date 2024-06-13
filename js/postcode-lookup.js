let map;
let marker;

$(document).ready(function() {

    $('#postcodeLookup').submit(function(event) {
        event.preventDefault();
        const postcode = $('#postcode').val();

        // Validation for the postcode textbox
        if (postcode.length > 7) {
            displayError('A UK postcode does not exceed 7 characters');
            return;
        }

        // API Callback for Postcodes.IO
        $.ajax({
            url: `https://api.postcodes.io/postcodes/${postcode}`, //endpoint callback for the Postcodes.IO API
            method: 'GET',
            success: function(data) {
                if (data.status === 200) {
                    displayResults(data.result);
                    showMap(data.result.latitude, data.result.longitude);
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
    }

    // An error message if the returning an invalid postcode
    function displayError(message) {
        const resultsDiv = $('#results');
        resultsDiv.html(`<p style="color: red;">${message}</p>`);
    }

    function showMap(lat, lng) {
        $('#map').show();
        // Initialize the map only if it hasn't been initialized yet
        if (!map) {
            map = L.map('map').setView([lat, lng], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            marker = L.marker([lat, lng]).addTo(map);
        } else {
            map.setView([lat, lng], 13);
            marker.setLatLng([lat, lng]);
        }
    }
});