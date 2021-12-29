function _put(db, req, callback)
{
    return db.upsert(req, callback);
}

function _get(db, req)
{
    return db.get(req).then((response) => { return response; }).catch((e) => { return false;});
}

/* setup databases */
let db =
{
    characters: { db: new PouchDB("characters"),
        put: function (req, callback) { return _put(this.db, req, callback); },
        get: function (req) { return _get(this.db, req); }
    },
    games: { db: new PouchDB("games"),
        put: function (req, callback) { return _put(this.db, req, callback); },
        get: function (req) { return _get(this.db, req); }
    },
    user: { db: new PouchDB("user"),
        put: function (req, callback) { return _put(this.db, req, callback); },
        get: function (req) { return _get(this.db, req); }
    },
    peers: { db: new PouchDB("peers"),
        put: function (req, callback) { return _put(this.db, req, callback); },
        get: function (req) { return _get(this.db, req); }
    },
}

/* db utils */



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
