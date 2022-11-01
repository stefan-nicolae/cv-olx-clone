


const MapsKey = "AIzaSyAIfwB5a40jpDuAnWFffeuE7GWa9F_KS30"


async function getLatLng (cityName) {
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${cityName}&key=${MapsKey}`).then(res => res.json()).then(res => {
        if (res.status === "OK") return res.results[0].geometry.location
        else return false

    })

}

function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}


export function getDistanceBetweenCities (city1, city2) {
    let city1Loc 
    let city2Loc 

    const result = getLatLng(city1).then(res => {
            city1Loc = res
            return getLatLng(city2).then(res2 => {
                    city2Loc = res2
                    if(res && res2) return distance(city1Loc.lat, city1Loc.lng, city2Loc.lat, city2Loc.lng, "K") 
                    else return false
            })
    })
    return result
}