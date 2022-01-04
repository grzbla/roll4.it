var c;
/* LOAD */
//get user id
async function init()
{
    let userID = await db.user.get("id");
    if (userID)
    {
        /* ATTACHG CONTROL EVENTS */
        attachControlEvents();

        /* LOAD SAVED */
        loadCharacter();

        /* DISPLAY CHARSHEET */
        setTimeout(() => //delay by 300ms for smoother experience
        {
            let loading = document.querySelector(".loading");
            loading.classList.add("invisible");
            setTimeout( (loading) => { loading.parentNode.removeChild(loading); }, 300, loading);
            document.querySelector(".characterSheet").classList.remove("invisible");
            document.querySelector(".characterSheet").classList.add("visible");
        }, 300);
    }
    else
        initUserID();
}

//wild times, there's no user id but one must be set before loading
function initUserID()
{
    db.user.put("id", (userID) =>
    {
        userID.value = uuidv4();
        return userID;
    }).then(() =>
    {
        init();
    });
}

async function loadCharacter()
{
    let characterId = "characterid";
    let character = await db.characters.get(characterId);

    if (!character) //don't bother if no character
        return;

    Object.keys(character).forEach((key) =>
    {
        let v = character[key]; //v as in variable, ingenious, i know
        if (typeof v === 'object')
        {
            let element = document.querySelector("[var=\"" + key + "\"]");

            //loat attributes
            if (v.value)
                element.querySelector(".value").textContent = v.value;
            if (v.modifier)
                element.querySelector(".modifier").textContent = v.modifier;
            if (v.proficiency)
                element.querySelector(".proficiency").classList.add("proficient");
            if (v.checked === false)
                element.querySelector(".icon").classList.add("hidden");
            if (v.croppedPic)
            {
                element.querySelector(".image").style.backgroundImage = "url(\"" + v.croppedPic + "\")";
            }
        }
    });
}
function attachControlEvents()
{
    //set fluff image upload and edit events
    document.querySelectorAll(".characterSheet .style div").forEach((element) =>
    {
        element.addEventListener("drop", handleDroppedImage);
        element.addEventListener("click", itemEditor);
        element.addEventListener("dragover", preventBrowserDefaultEvent);
    });

    // attribute mod input events
    document.querySelectorAll(".characterSheet .attributes div .modifier").forEach((element) =>
    {
        element.addEventListener("keypress", attributeModInputEvent);

    });

    //attribute value events
    document.querySelectorAll(".characterSheet .attributes div .value").forEach((element) =>
    {
        element.addEventListener("keypress", attributeValInputEvent);
    });

    //attribute proficiency events
    document.querySelectorAll(".characterSheet .attributes div .proficiency").forEach((element) =>
    {
        element.addEventListener("click", attributeProfInputEvent);
    });

    //hp value event
    document.querySelector(".characterSheet .secondary .hp .value").addEventListener("keypress", secondaryValInputEvent);

    //ac value event
    document.querySelector(".characterSheet .secondary .ac .value").addEventListener("keypress", secondaryValInputEvent);

    //proficiency value event
    document.querySelector(".characterSheet .secondary .proficiency .value").addEventListener("keypress", secondaryModInputEvent);

    //inspiration value event
    document.querySelector(".characterSheet .secondary .inspiration").addEventListener("click", inspirationInputEvent);

    //initiative value event
    document.querySelector(".characterSheet .secondary .initiative .value").addEventListener("keypress", secondaryModInputEvent);

    //passive wis value event
    document.querySelector(".characterSheet .secondary .passiveWis .value").addEventListener("keypress", secondaryValInputEvent);

    //speed value event
    document.querySelector(".characterSheet .secondary .speed .value").addEventListener("keypress", secondaryValInputEvent);

    //set gear image upload and edit events
    document.querySelectorAll(".characterSheet .secondary div[type=\"gear\"]").forEach((element) =>
    {
        element.addEventListener("drop", handleDroppedImage);
        element.addEventListener("click", itemEditor);
        element.addEventListener("dragover", preventBrowserDefaultEvent);
    });
}

/* functions */
function handleDroppedImage(event)
{
    let topEvent = event;
    preventBrowserDefaultEvent(event);
    var files = event.dataTransfer.files;

    //prevent errors
    if (!FileReader || !files || !files.length)
        return;

    var reader = new FileReader();
    reader.onload = function(event)
    {
        //write file to idb
        let characterId = "characterid";
        let pictureType = topEvent.target.getAttribute("var");
        db.characters.put(characterId, (character) =>
        {
            if (!character[pictureType])
                character[pictureType] = {};

            character[pictureType].fullPic = event.target.result;

            return character;
        }).then( () =>
        {
            /* add closing function to overlay */
            createOverlay();
            document.querySelector(".overlay").addEventListener("click", (event) =>
            {
                if (croppie)
                croppie.result({type: "base64", size: "viewport", format: "webp"}).then((image) =>
                {
                    document.querySelector("." + pictureType +" .image").style.backgroundImage = "url(\"" + image + "\")";
                    croppie.destroy();
                    let cropperContainer = document.querySelector(".cropperContainer");
                    cropperContainer.parentNode.removeChild(cropperContainer);

                    db.characters.put(characterId, (character) =>
                    {
                        character[pictureType].croppedPic = image;
                        return character;
                    });
                });
            });

            //display cropper
            openCroppie(event.target.result, pictureType);
        });
    };
    reader.readAsDataURL(files[0]);
}

function calculateElementRect(element) //um
{
    let boundingRect = element.getBoundingClientRect();

    let rect = {
        top: { vw: ((boundingRect.top / window.innerWidth) * 100 ).toFixed(2) },
        left: { vw: ((boundingRect.left / window.innerWidth) * 100 ).toFixed(2) }, //vw
        width: { px: (((boundingRect.right - boundingRect.left) * (window.screen.availWidth / window.innerWidth))).toFixed(2) }, //px
        height: { px: (((boundingRect.bottom - boundingRect.top) * (window.screen.availWidth / window.innerWidth))).toFixed(2) }, //px
    };

    return rect;
}

function openCroppie(image, pictureType)
{
    let rect = calculateElementRect(document.querySelector("." + pictureType));

    let target = document.createElement("div");
    target.className = "cropperContainer";
    target.style.width = rect.width.px + "px";
    target.style.height = rect.height.px + "px";
    target.style.top = (rect.top.vw - 1)  + "vw";
    target.style.left = (rect.left.vw - 1) + "vw";
    target.style.backgroundColor = "var(--background-color)";
    document.body.appendChild(target);

    croppie = new Croppie(target,
    {
        viewport: { width: rect.width.px + "px", height: rect.height.px + "px"},
        boundary: { width: rect.width.px + "px", height: rect.height.px + "px"}
    });
    croppie.bind(image);
}

function itemEditor(event)
{
    var topEvent = event;
    createOverlay();
    //close item editor on overlay click
    document.querySelector(".overlay").addEventListener("click", (event) =>
    {
        let itemEditor = document.querySelector(".itemEditor");
        itemEditor.parentNode.removeChild(itemEditor);
    });

    //create picture in original position
    let rect = calculateElementRect(topEvent.target);
    let picFrame =  document.createElement("div");
    picFrame.classList.add(topEvent.target.getAttribute("var"));
    picFrame.classList.add("itemEditor");
    picFrame.style.top = rect.top.vw + "vw";
    picFrame.style.left = rect.left.vw + "vw";
    picFrame.style.position = "absolute";
    picFrame.style.zIndex = "3";
    picFrame.setAttribute("type", topEvent.target.getAttribute("type"));

    let image = document.createElement("div");
    image.className = topEvent.target.querySelector(".image").className;
    image.style.backgroundImage = topEvent.target.querySelector(".image").style.backgroundImage;

    let name = document.createElement("div");
    name.className = "name";
    name.textContent = topEvent.target.querySelector(".name").textContent;

    picFrame.appendChild(image);
    picFrame.appendChild(name);
    document.body.appendChild(picFrame);

    // open image file / change image
    picFrame.addEventListener("click", function(event) { console.log("ass") });

    // select item from possessions icon


    // display description
    // left/bottom/right side

    // display text
    // left/right side
    // recrop image
}

function attributeModInputEvent(event)
{
    modInputEvent(event, async (event) =>
    {
        //auto set value
        let modString = event.target.textContent;
        let modInt = parseInt(modString.replace("+", ""));
        let valueString = String((modInt * 2) + 10);
        event.target.parentNode.querySelector(".value").textContent = valueString;


        //save locally
        /*
            //TODO: multiple character support
        */
        let attribute = event.target.parentNode.getAttribute("var");
        let characterId = "characterid";
        db.characters.put(characterId, (character) =>
        {
            /* TODO: REMOVE ALL INSTANCES OF THIS IF*/
            if (!character[attribute])
                character[attribute] = {};

            character[attribute].value = valueString;
            character[attribute].modifier = modString;
            return character;
        });

        //broadcast to peers

    });
}

function attributeValInputEvent(event)
{
    valInputEvent(event, (event) =>
    {
        let valueString = event.target.textContent;
        let modInt = Math.floor((parseInt(valueString) * 0.5) - 5);
        let modString = String(modInt);
        modString = (modInt > 0) ? "+" + modString : modString;
        event.target.parentNode.querySelector(".modifier").textContent = modString;

        //save locally
        /*
            //TODO: multiple character support
        */
        let attribute = event.target.parentNode.getAttribute("var");

        let characterId = "characterid";
        db.characters.put(characterId, (character) =>
        {
            if (!character[attribute])
                character[attribute] = {};

            character[attribute].value = valueString;
            character[attribute].modifier = modString;
            return character;
        });

        //broadcast to peers

    });
}

function attributeProfInputEvent(event)
{
    let target = event.target;
    let attribute = target.parentNode.getAttribute("var");
    let characterId = "characterid";

    if (target.classList.contains("proficient"))
    {
        // disable proficiency
        db.characters.put(characterId, (character) =>
        {
            delete character[attribute].proficiency;
            return character;
        }).then(() =>
        {
            target.classList.remove("proficient");
        });
    }
    else
    {
        // enable proficiency
        db.characters.put(characterId, (character) =>
        {
            // TODO: remove this if
            if (!character[attribute])
                character[attribute] = {};

            character[attribute].proficiency= true;

            return character;
        }).then(() =>
        {
            target.classList.add("proficient");
        });
    }
}

function inspirationInputEvent(event)
{
    let icon = event.target.querySelector(".icon");
    if (icon.classList.contains("hidden"))
    {
        // enable inspiration
        icon.classList.remove("hidden");

        let characterId = "characterid";
        db.characters.put(characterId, (character) =>
        {
            // TODO: remove this if
            if (!character.inspiration)
                character.inspiration = {};

            character.inspiration.checked = true;
            return character;
        });
    }
    else
    {
        // disable inspiration
        icon.classList.add("hidden");

        let characterId = "characterid";
        db.characters.put(characterId, (character) =>
        {
            // TODO: remove this if
            if (!character.inspiration)
                character.inspiration = {};

            character.inspiration.checked = false;
            return character;
        });
    }
    console.log(icon);
}

function secondaryModInputEvent(event)
{
    modInputEvent(event, (event) =>
    {
        //save locally
        /*
            //TODO: multiple character support
        */
        let attribute = event.target.parentNode.getAttribute("var");
        console.log(attribute);

        let characterId = "characterid";
        db.characters.put(characterId, (character) =>
        {
            if (!character[attribute])
                character[attribute] = {};

            character[attribute].value = event.target.textContent;
            return character;
        });

        //broadcast to peers
    })
}
function secondaryValInputEvent(event)
{
    valInputEvent(event, (event) =>
    {
        //save locally
        /*
            //TODO: multiple character support
        */
        let attribute = event.target.parentNode.getAttribute("var");
        console.log(attribute);

        let characterId = "characterid";
        db.characters.put(characterId, (character) =>
        {
            if (!character[attribute])
                character[attribute] = {};

            character[attribute].value = event.target.textContent;
            return character;
        });

        //broadcast to peers
    });
}

function modInputEvent(event, callback)
{
    let allowedChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-'];
    let signChars = ['+', '-', '0'];

    let selection = window.getSelection();
    let isSelection = (selection.extentOffset - selection.baseOffset) > 0 ? true : false;

    if (allowedChars.indexOf(event.key) === -1)
    {
        event.preventDefault();
        return;
    }

    if (event.target.textContent.length > 2 && !isSelection)
        event.preventDefault();

    setTimeout((signChars, event) =>
    {
        //add starting plus
        if (signChars.indexOf(event.target.textContent[0]) === -1)
        {
            event.target.textContent = "+" + event.target.textContent;
            //3 chars max
            if (event.target.textContent.length > 2)
                event.target.textContent = event.target.textContent.substring(0, 3);

            event.target.focus();

            if (typeof window.getSelection != "undefined"
                && typeof document.createRange != "undefined")
            {
                var range = document.createRange();
                range.selectNodeContents(event.target);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
            else if (typeof document.body.createTextRange != "undefined")
            {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(event.target);
                textRange.collapse(false);
                textRange.select();
            }

        }

        if (callback)
            callback(event);
    }, 100, signChars, event);
}

function valInputEvent(event, callback)
{
    let allowedChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    if (allowedChars.indexOf(event.key) === -1)
    {
        event.preventDefault();
        return;
    }

    let selection = window.getSelection();
    let isSelection = (selection.extentOffset - selection.baseOffset) > 0 ? true : false;

    if (event.target.textContent.length > 2 && !isSelection)
        event.preventDefault();

    setTimeout((event) =>
    {
        if (isNaN(event.target.textContent))
            return;

        if (callback)
            callback(event);
    }, 100, event);
}

init();
