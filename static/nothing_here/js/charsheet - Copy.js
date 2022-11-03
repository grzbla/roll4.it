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
                let image = element.querySelector(".image");
                image.style.backgroundImage = "url(\"" + v.croppedPic + "\")";
                image.classList.remove("empty");
            }
            if (v.blurb)
                element.querySelector(".blurb").textContent = v.blurb;
            if (v.name)
                element.querySelector(".name").textContent = v.name;
        }
    });

    if (character.name)
        document.querySelector(".fluff .name").textContent = character.name;
    if (character.levels)
        document.querySelector(".fluff .levels").textContent = character.levels;

}

function attachControlEvents()
{
    // character name and level
    document.querySelectorAll(".characterSheet .fluff div").forEach((element) =>
    {
        element.addEventListener("input", (event) =>
        {
            db.characters.put("characterid", (character) =>
            {
                character[event.target.className] = element.textContent;
                return character;
            });
        });
    });

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
    document.querySelectorAll(".characterSheet .gear div[type=\"gear\"]").forEach((element) =>
    {
        element.addEventListener("drop", handleDroppedImage);
        element.addEventListener("click", itemEditor);
        element.addEventListener("dragover", preventBrowserDefaultEvent);
    });

    document.querySelector(".overlay").addEventListener("click", hideOverlay);

    document.querySelectorAll(".itemEditor .name, .itemEditor .description, .itemEditor .blurb").forEach((element) =>
    {
        element.addEventListener("input", itemEditorText);
    });

    document.querySelectorAll(".mechanics div").forEach( (element) =>
    {
        element.addEventListener("click", mechanicsEditor);
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
            displayOverlay();
            document.querySelector(".overlay").addEventListener("click", (event) =>
            {
                if (croppie)
                croppie.result({type: "base64", size: "viewport", format: "webp"}).then((image) =>
                {
                    let imageElement = document.querySelector("." + pictureType +" .image");
                    imageElement.style.backgroundImage = "url(\"" + image + "\")";
                    imageElement.classList.remove("empty");
                    croppie.destroy();

                    let cropperContainer = document.querySelector(".cropperContainer");
                    cropperContainer.classList.add("hidden");
                    cropperContainer.removeAttribute("style");

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
        width:
        {
            px: (((boundingRect.right - boundingRect.left) * (window.screen.availWidth / window.innerWidth))).toFixed(0), //px
            vw: (((boundingRect.right - boundingRect.left) / window.innerWidth) * 100).toFixed(2) //vw
        },
        height:
        {
            px: (((boundingRect.bottom - boundingRect.top) * (window.screen.availWidth / window.innerWidth))).toFixed(2), //px
            vw: (((boundingRect.bottom - boundingRect.top) / window.innerWidth) * 100).toFixed(2) //vw
        }
    };

    return rect;
}

function openCroppie(image, pictureType)
{
    let rect = calculateElementRect(document.querySelector("." + pictureType));

    let target = document.querySelector(".cropperContainer");
    target.style.width = rect.width.px + "px";
    target.style.height = rect.height.px + "px";
    target.style.top = (rect.top.vw - 1)  + "vw";
    target.style.left = (rect.left.vw - 1) + "vw";
    target.classList.remove("hidden");

    croppie = new Croppie(target,
    {
        viewport: { width: rect.width.px + "px", height: rect.height.px + "px"},
        boundary: { width: rect.width.px + "px", height: rect.height.px + "px"}
    });
    croppie.bind(image);
}

async function itemEditor(event)
{
    displayOverlay();
    //close item editor on overlay click
    document.querySelector(".overlay").addEventListener("click", (event) =>
    {
        let itemEditor = document.querySelector(".itemEditor");
        itemEditor.className = "itemEditor hidden";

        //reset itemEditor
        itemEditor.querySelector(".name").textContent = "";
        itemEditor.querySelector(".description").innerHTML = "";
        itemEditor.querySelector(".blurb").textContent = "";
    });

    //recreate picture in original position
    let rect = calculateElementRect(event.target);
    let itemEditor =  document.querySelector(".itemEditor");
    itemEditor.classList.add(event.target.getAttribute("var"));
    itemEditor.style.top = rect.top.vw + "vw";
    itemEditor.style.left = rect.left.vw + "vw";

    itemEditor.setAttribute("type", event.target.getAttribute("type"));

    let image = document.querySelector(".itemEditor .image");
    image.style.backgroundImage = event.target.querySelector(".image").style.backgroundImage;
    image.setAttribute("title", "Upload image.");

    // open image file / change image
    image.addEventListener("click", function(event) { console.log("ass") });

    let name = document.querySelector(".itemEditor .name");
    console.log(event.target.getAttribute("type"));
    console.log(event.target.className);
    name.textContent = document.querySelector(".characterSheet ." + event.target.getAttribute("type") + " ." + event.target.className + " .name").textContent;
    let description = document.querySelector(".itemEditor .description");
    let blurb = document.querySelector(".itemEditor .blurb");

    //load saved data
    let characterId = "characterid";
    let character = await db.characters.get(characterId);

    let item = character[event.target.getAttribute("var")];
    if (item)
    {
        if (item.name && (item.name !== name.textContent))
            name.textContent = item.name;

        if (item.description && (item.description !== description.innerHTML))
            description.innerHTML = item.description;

        if (item.blurb && (item.blurb !== blurb.textContent))
            blurb.textContent = item.blurb;
    }

    itemEditor.classList.remove("hidden");
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

function itemEditorText(event)
{
    let text = event.target.textContent;
    let html = event.target.innerHTML;
    let item = { field: event.target.className, type: event.target.parentNode.classList[1] };

    let field = document.querySelector("." + event.target.parentNode.getAttribute("type") + " ." + item.type + " ." + item.field);
    if (field)
    {
        if (item.field == "description")
            field.innerHTML = html
        else
            field.textContent = text;
    }

    let characterId = "characterid";

    db.characters.put(characterId, (character) =>
    {
        if (!character[item.type])
            character[item.type] = {};

        if (item.field == "description")
            character[item.type][item.field] = html;
        else
            character[item.type][item.field] = text;

        return character;
    });
}

function mechanicsEditor(event)
{
    console.log(event);
    // open mechanic editor

    //load entries for each subcategory

    //add entry button

    //on click show entry editor

    //
}

init();
