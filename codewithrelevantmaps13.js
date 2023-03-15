//import { searchTopics } from '/gh/MapYourIdea/webflow/mapSearch6.js';

var shareLink;
topicid;
description;
city;
shareimagetall;
shareimagewide;
shareImageURL;
firstplaceid;
firstplacename;
firstplacedescription;
firstplaceimage;
secondplaceid;
secondplacename;
secondplacedescription;
secondplaceimage;
idstring;
title;
email;
locationdetails;
delayInMilliseconds = 2e3;
Webflow = Webflow || [];


//Submit Actions
//  Places Near Area
Webflow.push(function () {
    $(document).off("submit"),
        $("#submitPlacesNearArea").click(function (e) {
            e.preventDefault();
            prompt = "Act as a local guide: list " + document.getElementById("description").value + " in " + document.getElementById("location").value + ". Categorize the results by type of place. Give me a one sentence description of each place using an informative and somewhat humorous tone.";
            title = document.getElementById("description").value + " near " + document.getElementById("location").value;
            window.title = title;
            submitMap(
                document.getElementById("location").value,
                title,
                document.getElementById("email").value,
                prompt
            );
        });
});

//  Trip Planning
Webflow.push(function () {
    $(document).off("submit"),
        $("#submitTripPlanning").click(function (e) {
            e.preventDefault();
            prompt = "Act as a local guide: Plan me a " + document.getElementById("tripNumDays").value + " day trip to " + document.getElementById("tripLocation").value + " for " + document.getElementById("tripGroupType").value + ".";
            title = document.getElementById("tripNumDays").value + " day trip for " + document.getElementById("tripGroupType").value;
            window.title = title;
            submitMap(
                document.getElementById("tripLocation").value,
                title,
                document.getElementById("tripEmail").value,
                prompt
            );
        });
});

//  History
Webflow.push(function () {
    $(document).off("submit"),
        $("#submitHistory").click(function (e) {
            e.preventDefault();
            prompt = "Act as historian: List places where historical events happened related to " + document.getElementById("historyEvent").value + " in " + document.getElementById("historyLocation").value + ". Give me a one sentence description of each place using an educational tone.";
            title = "Historical " + document.getElementById("historyEvent").value + " in " + document.getElementById("historyLocation").value;
            window.title = title;
            submitMap(
                document.getElementById("historyLocation").value,
                title,
                document.getElementById("historyEmail").value,
                prompt
            );
        });
});

//  Vibe
Webflow.push(function () {
    $(document).off("submit"),
        $("#submitVibe").click(function (e) {
            e.preventDefault();
            prompt = "Act as gen z person: List places with a " + document.getElementById("vibeVibe").value + " in " + document.getElementById("vibeLocation").value + ". Give me a one sentence description of each place using gen z slang.";
            title = document.getElementById("vibeVibe").value + " vibes in " + document.getElementById("vibeLocation").value;
            window.title = title;
            submitMap(
                document.getElementById("vibeLocation").value,
                title,
                document.getElementById("vibeEmail").value,
                prompt
            );
        });
});

//  Freeform
Webflow.push(function () {
    $(document).off("submit"),
        $("#submitFreeform").click(function (e) {
            e.preventDefault();
            prompt = "Act as tour guide: List places " + document.getElementById("freeformPrompt").value + " in " + document.getElementById("freeformLocation").value + ". Give me a one sentence about each place.";
            title = document.getElementById("freeformPrompt").value + " in " + document.getElementById("freeformLocation").value;
            window.title = title;
            submitMap(
                document.getElementById("freeformLocation").value,
                title,
                document.getElementById("freeformEmail").value,
                prompt
            );
        });
});

//  Text to Map
Webflow.push(function () {
    $(document).off("submit"),
        $("#submitTextToMap").click(function (e) {
            e.preventDefault();
            prompt = "List the places mentioned in this text: " + document.getElementById("textToMapPrompt").value + ". Most should be near " + document.getElementById("textToMapLocation").value + ".";
            title = "Custom Map in " + document.getElementById("textToMapLocation").value;
            window.title = title;
            submitMap(
                document.getElementById("textToMapLocation").value,
                title,
                document.getElementById("textToMapEmail").value,
                prompt
            );
        });
});




// Map Loading & Activation
function submitMap(e, t, o, p) {
    var emailForms = document.querySelectorAll("#email-form");
    for (var i = 0; i < emailForms.length; i++) {
        emailForms[i].classList.add("hide");
    }
    window.email = o,
        document.getElementById("loadingvideo").classList.remove("hide");
    document.getElementById("disclaimer").classList.remove("hide");
    buildMap(e, t, o, p);
}


//Create Map Functions
async function buildMap(e, t, o, p) {
    const n = await fetch("https://map.proxi.co/api/gpt", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: `{
            "location": "${e}",
            "description": "${t}",
            "email": "${o}",
            "custom_prompt": "${p}"
        }`,
    }),
        i = await n.json();
    if (n.ok) {
        console.log("good response"),
            document.getElementById("mapresult").src = i.cc_read_link,
            document.getElementById("loadingvideo").classList.add("hide"),
            document.getElementById("embedholder").classList.remove("hide"),
            document.getElementById("followupbuttons").classList.remove("hide"),
            document.getElementById("editinproxi").href = i.cc_write_link,
            document.getElementById("othermapsheader").classList.remove("hide");

        //Share Functions
        let n = encodeURIComponent("Check out my " + title + " map. I made it with MapsGPT! #mapsgpt");
        document.getElementById("shareheading").innerHTML = "Share your " + title + " map!",
            document.getElementById("facebookshare").href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(i.cc_read_link) + "&quote=" + n,
            document.getElementById("twittershare").href = "https://twitter.com/intent/tweet?text=" + n + "&url=" + encodeURIComponent(i.cc_read_link),
            document.getElementById("emailshare").href = "mailto:?subject=" + n + "&body=I%20just%20built%20this%20map%20with%20AI%20using%20MapsGPT.com.%20%0A%0ACheck%20it%20out.%20--%3E%20%0A" + encodeURIComponent(i.cc_read_link),
            document.getElementById("copytoclipboard").addEventListener("click", function () {
                navigator.clipboard.writeText(i.cc_read_link);
            }),

            //After Creation Actions
            window.city = e,
            window.description = t,
            window.topicid = i._id.$oid,
            windown.locationdetails = i.default_map_center,
            getTopics(e),
            amplitude.getInstance().setUserId(o),


            window.shareLink = i.cc_read_link,
            shareActions(),
            document.getElementById("sharediv").classList.remove("hide");

        // Get Relevant Maps
        //searchTopics(title, locationdetails);

        var a = {
            prompt: title,
            searchlocation: e,
            email: o, "topic_id.$oid":
                i._id.$oid
        };
        return amplitude.getInstance().logEvent("MapsGPT: Topic Created", a),
            i;
    }
    console.log("Network response was not ok."), console.log(i.status), console.log(i.message), document.getElementById("loadingvideo").classList.add("hide"), document.getElementById("errortext").classList.remove("hide");
}


// Share Map Fuctions

let element = document.getElementById("sharemap");

async function shareActions() {
    updateImage(topicid),
        await getPointData(topicid),
        await getShareImage();
}
async function updateImage(e) {
    const t = await fetch("https://map.proxi.co/api/topics/" + e, { method: "GET", headers: { accept: "application/json", "Content-Type": "application/json" } }),
        o = await t.json();
    if (t.ok) return (window.shareImageURL = o.custom_social_media_image);
    (document.getElementById("socialshareimg").src = o.custom_social_media_image);
    window.locationdetails = o.default_map_center,
        o;
    console.log("Network response was not ok."), document.getElementById("loadingvideo").classList.add("hide"), document.getElementById("errortext").classList.remove("hide");
}

//Get Points for Tall Image Creation
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
                encodeURIComponent("Check out my map: " + description) +
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

//Reset Page
function reset() {
    var emailForms = document.querySelectorAll("#email-form");
    for (var i = 0; i < emailForms.length; i++) {
        emailForms[i].classList.remove("hide");
    }
    document.getElementById("location").value = document.getElementById("location").value,
        document.getElementById("description").value = document.getElementById("description").value,
        document.getElementById("email").value = email,
        document.getElementById("tripEmail").value = email,
        document.getElementById("historyEmail").value = email,
        document.getElementById("vibeEmail").value = email,
        document.getElementById("textToMapEmail").value = email,
        document.getElementById("freeformEmail").value = email,
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
