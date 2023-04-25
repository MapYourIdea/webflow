
function geoip(json) {

  // The JSON data returned from GeoJS is parsed and the relevant fields are extracted and assigned to variables.
  var city = json.city;
  var country = json.country;
  var latitude = json.latitude;
  var longitude = json.longitude;

  var cityName = city || country;
  document.getElementById("city").innerHTML = cityName;

  let userLocation = {
      search: cityName,
      place_id: "",
      latLng: {
          lat: latitude,
          lng: longitude
      },
  };
  searchTopics(userLocation, cityName);
}


async function searchTopics(userLocation, cityName) {
  const searchFilter = {
      "search_filter.location_match": {
          location: userLocation,
          max_distance: 2000,
      },
      "minimum_point_count": 12,
      "search_filter.keyword_search": {
          "operator": "or",
          "keywords": [
              cityName, cityName, cityName, cityName
          ]
      }
  };
  try {
      const response = await fetch("https://map.proxi.co/api/topics/search", {
          method: "POST",
          body: JSON.stringify(searchFilter),
          headers: {
              "Content-Type": "application/json",
          },
      });
      const data = await response.json();
      let slice = data.slice(0, 6)
      let e = slice.sort((a, b) => b.statistics.approximate_topic_thirty_day_views - a.statistics.approximate_topic_thirty_day_views);
      if (response.status >= 200 && response.status < 400) {
          const t = document.getElementById("Cards-Container");
          e.forEach((e) => {
              const o = document.getElementById("samplestyle").cloneNode(!0);
              o.setAttribute("id", ""),
                  (o.style.display = "block"),
                  o.classList.add("suggestedMap"),
                  o.addEventListener("click", function () {
                      document.location.href = e.discover_details_link;
                  }),
                  (o.getElementsByTagName("IMG")[0].src = e.custom_social_media_image),
                  (o.getElementsByTagName("H3")[0].textContent = e.name),
                  t.appendChild(o);
          });
      }
  } catch (error) {
      console.log('error')
  }
}