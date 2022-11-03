let croppie;

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

function displayOverlay()
{
    let overlay = document.querySelector(".overlay");
    overlay.classList.remove("hidden");
}

function hideOverlay()
{
    let overlay = document.body.querySelector(".overlay");
    overlay.classList.add("hidden");
}
