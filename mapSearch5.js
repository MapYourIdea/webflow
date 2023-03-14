async function searchTopics(topicName, searchLocation) {
  const searchFilter = {};
  searchFilter.location_match = {
    location: searchLocation,
    max_distance: 20000,
  };
  const search_text = topicName
    .trim()
    .toLocaleLowerCase()
    .replace(/[^0-9a-z ]/gi, "")
    .split(" ");
  searchFilter.keyword_search = {
    operator: "or",
    keywords: search_text,
    sub_searches: [],
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
    let e = data.slice(0, 6);
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
    console.error(error);
  }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports.searchTopics = searchTopics;
}