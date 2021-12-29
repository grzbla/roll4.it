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
        let v = character[key];
        if (typeof v === 'object')
        {
            let element = document.querySelector("[var=\"" + key + "\"]");
            //loat attributes
            if (v.value)
                element.querySelector(".value").textContent = v.value;
            if (v.mod)
                element.querySelector(".mod").textContent = v.mod;
            if (v.pro)
                element.querySelector(".proficiency").classList.add("proficient");
        }
    });
}

function attachControlEvents()
{
    // attribute mod input events
    document.querySelectorAll(".characterSheet .attributes div .mod").forEach((element) =>
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
    document.querySelectorAll(".characterSheet .secondary .hp .value").forEach((element) =>
    {
        element.addEventListener("keypress", hpInputEvent);
    });

    //ac value event
    document.querySelectorAll(".characterSheet .secondary .ac .value").forEach((element) =>
    {
        element.addEventListener("keypress", acInputEvent);
    });

    //proficiency value event
    document.querySelectorAll(".characterSheet .secondary .proficiency .value").forEach((element) =>
    {
        element.addEventListener("keypress", modInputEvent);
    });

    //initiative value event
    document.querySelectorAll(".characterSheet .secondary .initiative .value").forEach((element) =>
    {
        element.addEventListener("keypress", modInputEvent);
    });

    //passive wis value event
    document.querySelectorAll(".characterSheet .secondary .passiveWis .value").forEach((element) =>
    {
        element.addEventListener("keypress", valInputEvent);
    });

    //speed value event
    document.querySelectorAll(".characterSheet .secondary .speed .value").forEach((element) =>
    {
        element.addEventListener("keypress", valInputEvent);
    });

}

/* functions */
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
            character[attribute].mod = modString;
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
        event.target.parentNode.querySelector(".mod").textContent = (modInt > 0) ? "+" + modString : modString;

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
            character[attribute].mod = modString;
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
            delete character[attribute].pro;
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

            character[attribute].pro = true;

            return character;
        }).then(() =>
        {
            target.classList.add("proficient");
        });
    }
}

function hpInputEvent()
{

}
function acInputEvent()
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

    console.log(event.key);
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
