var shareLink,
    topicid,
    description,
    city,
    shareimagetall,
    shareimagewide,
    shareImageURL,
    firstplaceid,
    firstplacename,
    firstplacedescription,
    firstplaceimage,
    secondplaceid,
    secondplacename,
    secondplacedescription,
    secondplaceimage,
    idstring,
    delayInMilliseconds = 2e3,
    Webflow = Webflow || [];
function submitMap(e, t, o) {
    document.getElementById("email-form").classList.add("hide"), document.getElementById("loadingvideo").classList.remove("hide"), document.getElementById("disclaimer").classList.remove("hide"), buildMap(e, t, o);
}
async function buildMap(e, t, o) {
    const n = await fetch("https://map.proxi.co/api/gpt", {
            method: "POST",
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            body: `{\n        "location": "${e}",\n        "description": "${t}",\n        "email": "${o}"\n      }`,
        }),
        i = await n.json();
    if (n.ok) {
        console.log("good response"),
            (document.getElementById("mapresult").src = i.cc_read_link),
            document.getElementById("loadingvideo").classList.add("hide"),
            document.getElementById("embedholder").classList.remove("hide"),
            document.getElementById("followupbuttons").classList.remove("hide"),
            (document.getElementById("editinproxi").href = i.cc_write_link),
            document.getElementById("othermapsheader").classList.remove("hide");
        let n = encodeURIComponent("Check out my " + t + " near " + e + " map. I made it with MapsGPT! #mapsgpt");
        (document.getElementById("shareheading").innerHTML = "Share your " + t + " map!"),
            (document.getElementById("facebookshare").href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(i.cc_read_link) + "&quote=" + n),
            (document.getElementById("twittershare").href = "https://twitter.com/intent/tweet?text=" + n + "&url=" + encodeURIComponent(i.cc_read_link)),
            (document.getElementById("emailshare").href = "mailto:?subject=" + n + "&body=I%20just%20built%20this%20map%20with%20AI%20using%20MapsGPT.com.%20%0A%0ACheck%20it%20out.%20--%3E%20%0A" + encodeURIComponent(i.cc_read_link)),
            document.getElementById("copytoclipboard").addEventListener("click", function () {
                navigator.clipboard.writeText(i.cc_read_link);
            }),
            (window.city = e),
            (window.description = t),
            (window.topicid = i._id.$oid),
            getTopics(e),
            amplitude.getInstance().setUserId(o),
            (window.shareLink = i.cc_read_link),
            shareActions(),
            document.getElementById("sharediv").classList.remove("hide");
        var a = { prompt: t, searchlocation: e, email: o, "topic_id.$oid": i._id.$oid };
        return amplitude.getInstance().logEvent("MapsGPT: Topic Created", a), i;
    }
    console.log("Network response was not ok."), console.log(i.status), console.log(i.message), document.getElementById("loadingvideo").classList.add("hide"), document.getElementById("errortext").classList.remove("hide");
}
Webflow.push(function () {
    $(document).off("submit"),
        $("form").submit(function (e) {
            e.preventDefault(), submitMap(document.getElementById("location").value, document.getElementById("description").value, document.getElementById("email").value);
        });
});
let searchURL = new URL("https://map.proxi.co/api/topics?search_filter.include_only_collaborative=false&search_filter.is_public_search=true&search_filter.search_text=");
function getTopics(e) {
    let t = new XMLHttpRequest(),
        o = e,
        n = searchURL.toString() + encodeURIComponent(o);
    t.open("GET", n, !0),
        (t.onload = function () {
            let e = JSON.parse(this.response)
                .sort(() => 0.5 - Math.random())
                .slice(0, 6);
            if (t.status >= 200 && t.status < 400) {
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
        }),
        t.send();
}
let element = document.getElementById("sharemap");
async function shareActions() {
    updateImage(topicid), await getPointData(topicid), await getShareImage();
}
async function updateImage(e) {
    const t = await fetch("https://map.proxi.co/api/topics/" + e, { method: "GET", headers: { accept: "application/json", "Content-Type": "application/json" } }),
        o = await t.json();
    if (t.ok) return (window.shareImageURL = o.custom_social_media_image), (document.getElementById("socialshareimg").src = o.custom_social_media_image), o;
    console.log("Network response was not ok."), document.getElementById("loadingvideo").classList.add("hide"), document.getElementById("errortext").classList.remove("hide");
}
async function getPointData(e) {
    const t = await fetch("https://map.proxi.co/api/topics/" + e + "/points?use_cache=false", { method: "GET", headers: { accept: "application/json", "Content-Type": "application/json" } }),
        o = await t.json();
    if (t.ok) {
        let e = o.slice(0, 2);
        return (
            (window.firstplaceid = e[0]._id.$oid),
            (window.firstplacename = e[0].name),
            (window.firstplacedescription = e[0].description),
            (window.secondplaceid = e[1]._id.$oid),
            (window.secondplacename = e[1].name),
            (window.secondplacedescription = e[1].description),
            (window.selectedPlaces = e),
            getImageOne(firstplaceid),
            getImageTwo(secondplaceid),
            o
        );
    }
    console.log("Network response was not ok."), document.getElementById("loadingvideo").classList.add("hide"), document.getElementById("errortext").classList.remove("hide");
}
function getImageOne(e) {
    fetch("https://map.proxi.co/api/points/" + e + "/place_details?use_cache=false", { method: "GET", headers: { accept: "application/json", "Content-Type": "application/json" } })
        .then(function (e) {
            return e.json();
        })
        .then(function (e) {
            let t = e.photos[0];
            window.firstplaceimage = t;
        });
}
function getImageTwo(e) {
    fetch("https://map.proxi.co/api/points/" + e + "/place_details?use_cache=false", { method: "GET", headers: { accept: "application/json", "Content-Type": "application/json" } })
        .then(function (e) {
            return e.json();
        })
        .then(function (e) {
            let t = e.photos[0];
            window.secondplaceimage = t;
        });
}
function getShareImage() {
    setTimeout(function () {
        let e =
                "https://api.placid.app/u/gussx0r6q?" +
                ("prompt[text]=" +
                    encodeURIComponent("Check out my map of <b>" + description + "</b> near  <b>" + city + "</b>") +
                    "&placeonetitle[text]=" +
                    encodeURIComponent(firstplacename) +
                    "&placeonedescription[text]=" +
                    encodeURIComponent(firstplacedescription) +
                    "&placetwotitle[text]=" +
                    encodeURIComponent(secondplacename) +
                    "&placetwodescription[text]=" +
                    encodeURIComponent(secondplacedescription) +
                    "&placeoneimage[image]=" +
                    encodeURIComponent(firstplaceimage) +
                    "&placetwoimage[image]=" +
                    encodeURIComponent(secondplaceimage)),
            t = shareImageURL;
        (document.getElementById("cover").href = t), (document.getElementById("story").href = e);
    }, delayInMilliseconds);
}
function reset() {
    document.getElementById("email-form").classList.remove("hide"),
        (document.getElementById("location").value = document.getElementById("location").value),
        (document.getElementById("description").value = document.getElementById("description").value),
        (document.getElementById("email").value = document.getElementById("email").value),
        document.getElementById("embedholder").classList.add("hide"),
        document.getElementById("logintoproxi").classList.remove("hide"),
        document.getElementById("mapsize").classList.remove("long"),
        document.getElementById("followupbuttons").classList.add("hide"),
        removeSuggestions(),
        document.getElementById("othermapsheader").classList.add("hide"),
        document.getElementById("disclaimer").classList.add("hide"),
        document.getElementById("errortext").classList.add("hide"),
        document.getElementById("sharediv").classList.add("hide"),
        document.getElementById("loadingimage").classList.remove("hide"),
        document.getElementById("sharepictures").classList.add("hide");
}
function removeSuggestions() {
    Array.from(document.getElementsByClassName("suggestedMap")).forEach((e) => {
        e.remove();
    });
}
