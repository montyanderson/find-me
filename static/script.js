const token = [...(new URLSearchParams(location.href)).values()][0];

const clientId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

mapboxgl.accessToken = 'pk.eyJ1IjoibW9udHlhbmRlcnNvbiIsImEiOiJja2EzNmF6YmMwMHliM21tdjUxcHQzNHY2In0.kI_uE_4N8EtAYfNZHHwaaA';

let map;

const getLocation = async () => await new Promise(resolve =>
	 navigator.geolocation.getCurrentPosition(resolve));

async function initMap() {
	const { coords } = await getLocation();

	map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v11',
		zoom: 12,
		center: [ coords.longitude, coords.latitude ]
	});
}

async function pushLocation() {
	const { coords } = await getLocation();

	const response = await fetch('api/push-location', {
		method: 'POST',
		body: JSON.stringify({
			coords: {
				longitude: coords.longitude,
				latitude: coords.latitude
			},
			clientId,
			token
		}),
		headers: {
			"Content-Type": "application/json"
			//"Accept": "application/json"
		}
	});

	const locations = await response.json();

	console.log(locations);
}

initMap();
pushLocation();
setInterval(pushLocation, 2 * 1000);
