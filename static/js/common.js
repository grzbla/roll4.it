function _put(db, data)
{
    db.upsert(data._id, function (doc)
    {
        return data;
    });
}

let db =
{
    fluffAssets: { db: new PouchDB("fluffAssets"),
        put: function (data) { _put(this.db, data); },
        get: function (data) { return this.db.get(data); }
    },
    charData: { db: new PouchDB("charData"),
        put: function (data) { _put(this.db, data); },
        get: function (data) { return this.db.get(data); }
    }
}

function preventBrowserDefaultEvent(event)
{
    event.preventDefault();
    event.stopPropagation();
}

function createOverlay()
{
    var overlay = document.createElement("div");
    overlay.setAttribute("class", "overlay");

    overlay.addEventListener("click", removeOverlay);

    document.body.appendChild(overlay);
}

function removeOverlay()
{
    let overlay = document.body.querySelector(".overlay");
    overlay.parentNode.removeChild(overlay);
}

function removeCropperContainer()
{
    let container = document.querySelector(".cropperContainer");
    container.parentNode.removeChild(container);
}
