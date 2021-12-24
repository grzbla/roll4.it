let croppie;

function

function run()
{
    // sets event handling for fluff image cards
    document.querySelectorAll(".fluffCardLarge, .fluffCardSmall").forEach(element =>
    {
        //set fluff image upload events
        element.addEventListener("drop", handleDroppedFluffImage);
        element.addEventListener("click", itemEditor);
        element.addEventListener("dragover", preventBrowserDefaultEvent);

        //fluff type variable = second class in className. shit i know.
        let splat = element.className.split(" ");
        let fluffType = splat[1];

        db.fluffAssets.get(fluffType).then( (doc) =>
        {
            document.querySelector("." + fluffType).style.backgroundImage = "url(\"" + doc.image + "\")";
        }).catch(() => {}); //silence errors when not found
    });

    //adds event handling for attribute frames
    document.querySelectorAll(".attributeFrame ").forEach(element =>
    {
        let attributeValue = element.querySelector(".attributeValue");
        attributeValue.addEventListener("change", updateAttributeInput);
        let attributeMod = element.querySelector(".attributeMod");
        attributeMod.addEventListener("change", updateAttributeModInput);


        //attribute type = second class in className
        let splat = element.className.split(" ");
        let attributeName = splat[1];

        db.charData.get(attributeName).then ( (doc) =>
        {
            if (isNaN(doc.value))
                return;

            attributeValue.value = doc.value;
            attributeMod.value = Math.floor(doc.value * 0.5) - 5;

        }).catch(() => {});
    });

    //adds event handling for char name field
    let charName = document.querySelector(".characterName");
    charName.addEventListener("input", function(event)
    {
        db.charData.put({_id: "characterName", value: event.target.textContent});
    });
    db.charData.get("characterName").then((doc) =>
    {
        charName.textContent = doc.value;
    }).catch(() => {});

    //adds event handling for char classes field
    let charClasses = document.querySelector(".characterClasses");
    charClasses.addEventListener("input", function(event)
    {
        db.charData.put({_id: "characterClasses", value: event.target.textContent});
    });
    db.charData.get("characterClasses").then((doc) =>
    {
        charClasses.textContent = doc.value;
    }).catch(() => {});

    //adds event handling for character assets frames
    document.querySelectorAll(".characterAssetsFrame .addCharacterAsset").forEach(function(assetsFrame)
    {
        assetsFrame.addEventListener("click", openAssetEditor);
    });
}

function openAssetEditor(event)
{
    createOverlay();
    let assetContainer = document.createElement("div");
    assetContainer.setAttribute("class", "assetContainer");

    document.querySelector(".overlay").addEventListener("click", function(event)
    {
        assetContainer.parentNode.removeChild(assetContainer);
    });

    let assetName = document.createElement("div");
    assetName.setAttribute("contenteditable", "true");
    assetName.setAttribute("class", "name");
    assetName.setAttribute("title", "Name");

    let assetDescription = document.createElement("div");
    assetDescription.setAttribute("contenteditable", "true");
    assetDescription.setAttribute("class", "description");
    assetDescription.setAttribute("title", "Description");
    //TODO write assetName to indexeddb

    let assetURL = document.createElement("div");
    assetURL.setAttribute("contenteditable", "true");
    assetURL.setAttribute("class", "url");
    assetURL.setAttribute("title", "URL");
    //TODO write assetName to indexeddb

    let assetUpload = document.createElement("div");
    assetUpload.setAttribute("class", "imageUpload");
    assetUpload.setAttribute("title", "Upload image");

    assetUpload.setAttribute("fluffType", event.target.parentNode.getAttribute("class").split(" ")[1]);
    assetUpload.innerHTML = "<i class=\"fas fa-file-upload\"></i>";
    assetUpload.addEventListener("click", imageOpener);

    assetContainer.appendChild(assetName);
    assetContainer.appendChild(assetDescription);
    assetContainer.appendChild(assetURL);
    assetContainer.appendChild(assetUpload);
    document.body.appendChild(assetContainer);
}

function openCroppie(imageDataURL, fluffType)
{
    let fluffMinor = ["fluffHead", "fluffShoulders", "fluffForearms", "fluffHands",
                    "fluffWaist", "fluffFeet", "fluffEarrings", "fluffNeck",
                    "fluffLeftBracelet", "fluffRightBracelet", "fluffLeftRing", "fluffRightRing"];
    let croppieSize = { width: 420, height: 460 };

    if (fluffMinor.includes(fluffType))
        croppieSize = { width: 194, height: 160 };

    croppie = new Croppie(document.querySelector('.cropperContainer'),
    {
        viewport: croppieSize,
        boundary: { width: 520, height: 560 }
    });

    croppie.bind(imageDataURL);
}

function openImageCropper(imageDataURL, fluffType)
{
    let cropperContainer = document.createElement("div");
    cropperContainer.setAttribute("class", "cropperContainer");

    let cropperConfirm = document.createElement("div");
    cropperConfirm.setAttribute("class", "cropperConfirm");
    cropperConfirm.innerHTML = "<i class=\"fas fa-check\"></i>";
    cropperConfirm.addEventListener("click", function(event)
    {
        setCroppedImage(croppie, fluffType);
        removeOverlay();
        removeCropperContainer();
    });

    createOverlay();
    cropperContainer.appendChild(cropperConfirm);
    document.body.appendChild(cropperContainer);

    document.querySelector(".overlay").addEventListener("click", function(event)
    {
        removeCropperContainer();
    });

    openCroppie(imageDataURL, fluffType);
}

function setCroppedImage(croppie, fluffType)
{
    if (croppie)
    croppie.result({type: "base64", size: "viewport", format: "png"}).then(function(image)
    {
        let blacklist = ["characterCompetences", "characterPossessions", "classTraits"];
        if (!(blacklist.includes(fluffType))) //TODO this tardy thing
            document.querySelector("." + fluffType).style.backgroundImage = "url(\"" + image + "\")";
        else
        {
            //process character assets
        }


        croppie.destroy();
        //store locally
        db.fluffAssets.put(
        {
            _id: fluffType,
            image: image,
            pouch: "fluffAssets"
        });
    });
}

function handleOpenedFluffImage(event)
{
    var target = event.target || window.event.srcElement, files = target.files;

    // FileReader support
    if (FileReader && files && files.length)
    {
        var reader = new FileReader();
        reader.onload = function ()
        {
            //close item editor
            removeOverlay();
            let itemEditor = document.querySelector(".itemEditor");
            if (itemEditor)
                itemEditor.parentNode.removeChild(itemEditor);

            let assetContainer = document.querySelector(".assetContainer");
            if (assetContainer)
                assetContainer.parentNode.removeChild(assetContainer);

            //open image cropper
            openImageCropper(reader.result, target.getAttribute("fluffType"));
        }
        reader.readAsDataURL(files[0]);
    }
}

function handleDroppedFluffImage(event)
{
    preventBrowserDefaultEvent(event);
    let files = event.dataTransfer.files;
    if (FileReader && files && files.length)
    {
        var reader = new FileReader();
        reader.onload = function ()
        {
            let splat = event.target.className.split(" ")[1];

            openImageCropper(reader.result, splat);
        }
        reader.readAsDataURL(files[0]);
    }
}
function handleReopenedFluffImage(event)
{
    removeOverlay();
    let container = document.querySelector(".itemEditor");
    container.parentNode.removeChild(container);
    let fluffType = event.target.getAttribute("fluffType");

    db.fluffAssets.get(fluffType).then( (doc) =>
    {
        //convert blob to image url
         (event.target.result, fluffType);
    });

}

function itemEditor(event)
{
    let fluffType = event.target.className.split(" ")[1];
    let itemEditor = document.createElement("div");
    itemEditor.setAttribute("class", "itemEditor");

    let itemName = document.createElement("div");
    itemName.setAttribute("contenteditable", "true");
    itemName.setAttribute("class", "name");
    itemName.setAttribute("title", "Name");

    let itemDescription = document.createElement("div");
    itemDescription.setAttribute("contenteditable", "true");
    itemDescription.setAttribute("class", "description");
    itemDescription.setAttribute("title", "Description");
    //TODO write itemName to indexeddb

    let itemURL = document.createElement("div");
    itemURL.setAttribute("contenteditable", "true");
    itemURL.setAttribute("class", "url");
    itemURL.setAttribute("title", "URL");
    //TODO write itemName to indexeddb

    let itemUpload = document.createElement("div");
    itemUpload.setAttribute("class", "imageUpload");
    itemUpload.setAttribute("title", "Upload image");

    itemUpload.setAttribute("fluffType", event.target.getAttribute("class").split(" ")[1]);
    itemUpload.innerHTML = "<i class=\"fas fa-file-upload\"></i>";
    itemUpload.addEventListener("click", imageOpener);

    let itemLink = document.createElement("div");
    itemLink.setAttribute("class", "link");
    itemLink.innerHTML = "<i class=\"fas fa-external-link-alt\"></i>";
    itemLink.setAttribute("title", "Click to open URL link");
    itemLink.addEventListener("click", function(event)
    {
        preventBrowserDefaultEvent(event);
        let url = document.querySelector(".itemEditor .url").textContent;

        //add http if missing to avoid opening relative paths
        if (!(new RegExp("^https?://", "i").test(url)))
            url = "http://" + url;

        try
        {
            window.open(url, "_blank");
        } catch {};
    });


    //draw ui elements
    createOverlay();
    itemEditor.appendChild(itemName);
    itemEditor.appendChild(itemDescription);
    itemEditor.appendChild(itemURL);
    itemEditor.appendChild(itemLink);
    itemEditor.appendChild(itemUpload);
    document.body.appendChild(itemEditor);
    document.querySelector(".overlay").addEventListener("click", function(event)
    {
        itemEditor.parentNode.removeChild(itemEditor);
    });
}
function imageOpener(event)
{
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("id", "imageInput");
    input.setAttribute("accept", "image/*");
    input.style.setProperty("position", "absolute");
    input.style.setProperty("opacity", "0");
    input.setAttribute("fluffType", event.target.getAttribute("fluffType"));
    input.addEventListener("change", handleOpenedFluffImage);
    document.body.appendChild(input);
    input.click();
}

function updateAttributeInput(event)
{
    let value = parseInt(event.target.value);
    if(isNaN(value))
        return;

    event.target.parentNode.querySelector(".attributeMod").value = Math.floor(parseInt(value) * 0.5) - 5;
    db.charData.put(
    {
        _id: event.target.parentNode.className.split(" ")[1],
        value: parseInt(event.target.value)
    });
}
function updateAttributeModInput(event)
{
    let value = (parseInt(event.target.value) + 5 ) * 2;
    if (isNaN(value))
        return;

    event.target.parentNode.querySelector(".attributeValue").value = value;
    db.charData.put(
    {
        _id: event.target.parentNode.className.split(" ")[1],
        value: parseInt(value)
    });
}

run();
