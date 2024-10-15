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
    title,
    email,
    locationdetails,
    delayInMilliseconds = 2e3,
    Webflow = Webflow || [];


//Submit Actions
//  Check for Blanks
function checkFormElementsEmpty(formElements) {
  for (var i = 0; i < formElements.length; i++) {
    if (formElements[i].value === '') {
      return true;
    }
  }
  return false;
}

//Submit Actions
//  Places Near Area
Webflow.push(function () {
    $(document).off("submit"),
    $("#submitPlacesNearArea").click(function (e) {
      e.preventDefault();
      prompt = "Act as a local guide: list " + document.getElementById("description").value + " in " + document.getElementById("location").value + ". Categorize the results by type of place. Give me a one sentence description of each place using an informative and somewhat humorous tone.";
      title = document.getElementById("description").value + " near "+ document.getElementById("location").value;
      window.title = title;

      var formElements = [document.getElementById("description"),document.getElementById("location"),document.getElementById("email")];
      var isFormEmpty = checkFormElementsEmpty(formElements);

      if (isFormEmpty) {
        alert("You're leaving us hanging! Please fill in all the fields");
      } else {
        submitMap(
          document.getElementById("location").value,
          title,
          document.getElementById("email").value,
          prompt
        );
      }
    });
});

//  Trip Planning
Webflow.push(function () {
    $(document).off("submit"),
    $("#submitTripPlanning").click(function (e) {
      e.preventDefault();
      prompt = "Act as a local guide: Plan me a " + document.getElementById("tripNumDays").value + " day itinerary for a trip to " + document.getElementById("tripLocation").value + " for " + document.getElementById("tripGroupType").value + ". Categorize the results by day of trip starting with Day 1 and ordering them sequentially. Include at least three places to visit on each day.";
      title = document.getElementById("tripNumDays").value + " day trip for " + document.getElementById("tripGroupType").value + " near " + document.getElementById("tripLocation").value;
      window.title = title;

      var formElements = [document.getElementById("tripGroupType"),document.getElementById("tripLocation"),document.getElementById("tripNumDays"),document.getElementById("tripEmail")];
      var isFormEmpty = checkFormElementsEmpty(formElements);
      
      if (isFormEmpty) {
        alert("You're leaving us hanging! Please fill in all the fields");
      } else {
        submitMap(
          document.getElementById("tripLocation").value,
          title,
          document.getElementById("tripEmail").value,
          prompt
        );
      }  
    });
});

//  History
Webflow.push(function () {
    $(document).off("submit"),
    $("#submitHistory").click(function (e) {
      e.preventDefault();
      prompt = "Act as historian: List places where historical events happened related to " +  document.getElementById("historyEvent").value + " in " + document.getElementById("historyLocation").value + ". Categorize the results by theme. Give me a one sentence description of each place using an educational tone.";
      title = document.getElementById("historyEvent").value + " history in " + document.getElementById("historyLocation").value;
      window.title = title;

      var formElements = [document.getElementById("historyEvent"),document.getElementById("historyLocation"),document.getElementById("historyEmail")];
      var isFormEmpty = checkFormElementsEmpty(formElements);
      
      if (isFormEmpty) {
        alert("You're leaving us hanging! Please fill in all the fields");
      } else {
        submitMap(
          document.getElementById("historyLocation").value,
          title,
          document.getElementById("historyEmail").value,
          prompt
        );
      }
    });
});

//  Vibe
Webflow.push(function () {
    $(document).off("submit"),
    $("#submitVibe").click(function (e) {
      e.preventDefault();
      prompt = "Act as an executive assistant: List places to host a work event with a " +  document.getElementById("vibeVibe").value + " in " + document.getElementById("vibeLocation").value + ". Give me a one sentence description of each place and why it's a good place to host your work team. Categorize the results by type of place.";
      title = document.getElementById("vibeVibe").value + " vibes in " + document.getElementById("vibeLocation").value;
      window.title = title;

      var formElements = [document.getElementById("vibeVibe"),document.getElementById("vibeLocation"),document.getElementById("vibeEmail")];
      var isFormEmpty = checkFormElementsEmpty(formElements);

      if (isFormEmpty) {
        alert("You're leaving us hanging! Please fill in all the fields");
      } else {
        submitMap(
          document.getElementById("vibeLocation").value,
          title,
          document.getElementById("vibeEmail").value,
          prompt
        );
      }
    });
});

//  Freeform/Vendor
Webflow.push(function () {
    $(document).off("submit"),
    $("#submitFreeform").click(function (e) {
      e.preventDefault();
      prompt = "Act as tour guide: List vendors who provide " +  document.getElementById("freeformPrompt").value + " in " + document.getElementById("freeformLocation").value + ". Give me a one sentence about each vendor. Categorize the results by type of vendor. Try to have at least three places in each category.";
      title = document.getElementById("freeformPrompt").value + " in " + document.getElementById("freeformLocation").value;
      window.title = title;

      var formElements = [document.getElementById("freeformPrompt"),document.getElementById("freeformLocation"),document.getElementById("freeformEmail")];
      var isFormEmpty = checkFormElementsEmpty(formElements);

      if (isFormEmpty) {
        alert("You're leaving us hanging! Please fill in all the fields");
      } else {
        submitMap(
          document.getElementById("freeformLocation").value,
          title,
          document.getElementById("freeformEmail").value,
          prompt
        );
      }
    });
});

//  Text to Map
Webflow.push(function () {
    $(document).off("submit"),
    $("#submitTextToMap").click(function (e) {
      e.preventDefault();
      prompt = "List the places mentioned in the text below. Most places should be in or near " + document.getElementById("textToMapLocation").value + ". Categorize by type of place. Leave the description blank. Here is the prompt text:" +  document.getElementById("textToMapPrompt").value;
      title = "Custom map in " + document.getElementById("textToMapLocation").value;
      window.title = title;

      var formElements = [document.getElementById("textToMapPrompt"),document.getElementById("textToMapLocation"),document.getElementById("textToMapEmail")];
      var isFormEmpty = checkFormElementsEmpty(formElements);

      if (isFormEmpty) {
        alert("You're leaving us hanging! Please fill in all the fields");
      } else {
        submitMap(
          document.getElementById("textToMapLocation").value,
          title,
          document.getElementById("textToMapEmail").value,
          prompt
        );
      }
    });
});

// Map Loading & Activation
function submitMap(e, t, o, p) {
    var emailForms = document.querySelectorAll("#email-form");
    for (var i = 0; i < emailForms.length; i++) {
      emailForms[i].classList.add("hide");
    }
    window.email = o,
    document.getElementById("loadingvideo").classList.remove("hide"), 
    document.getElementById("tabcontent").classList.add("hide2"),
    buildMap(e, t, o, p);
}


//Create Map Functions
async function buildMap(e, t, o, p) {
    const n = await fetch("https://map.proxi.co/api/topic_create", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        location: e,
        max_points: 15,
        email: o,
        creation_method: {
          prompt: p
        }
      }),
    }),
        i = await n.json();
    if (n.ok) {
        console.log("good response"),
        amplitude.getInstance().setUserId(o),
        document.getElementById("loadingvideo").classList.add("hide");


        var a = {
            prompt: title, 
            searchlocation: e, 
            email: o, "topic_id.$oid": 
            i._id.$oid };

        return amplitude.getInstance().logEvent("Homepage GPT Mobile: Topic Created", a),

        //After Creation Actions
        window.location.replace(i.cc_write_link),


        
    i;}
    console.log("Network response was not ok."), 
    console.log(i.status), 
    console.log(i.message), 
    errorHandle(i.message, e, t, o, p),
    document.getElementById("errortext").classList.remove("hide");

    var b = {
      error: i.status, 
      message: i.message,
      prompt: t
    };

    return amplitude.getInstance().logEvent("Homepage GPT Mobile: Failed Creation", b);
  
}

// Error Handling


async function errorHandle(message,e, t, o, p) {
  var errorMessageElement = document.getElementById("errortextbox");

  if (message.includes("Point parsing failed")) {
    errorMessageElement.textContent = "Ope! We couldn't find enough places. Try another prompt.";
    document.getElementById("sendrequestagain").classList.add("hide");
  } else if (message.includes("The location could not be geocoded:")) {
    errorMessageElement.textContent = "Darn! I'm not smart enough to know where " + e + " is. Try making your search location more specific. Adding the country or city can help.";
    document.getElementById("sendrequestagain").classList.add("hide");
  } else {
    errorMessageElement.textContent = "Oh no, the AI is overwhelmed. Give us a sec then try again or update your prompt.";
  }
}




  