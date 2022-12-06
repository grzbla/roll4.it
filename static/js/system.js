function Hash(str)
{
    /*
        constructor for an object containing both hash and string
        gets passed by reference so its likely faster than string
        same speed as passing hash alone, but at the cost of couple bytes
    */
    s = str
    h = new MurmurHash3(s).result()

    this.set = (str) =>
    {
        s = str
        h = new MurmurHash3(s).result()
    }
    this.hash = () => { return h }
    this.string = () => { return s }

    return this
}

function HashMap()
{
    /*
        it's a hash map. thats it
        it works. i think
    */

    /*
        token maps in addition to base values map for ease of access
        in rare situations
    */
    this.strings = new Map() //strings mapped by hash, hash-string pair
    this.keys = new Map() //hashes mapped by string, string-hash pair
    this.values = new Map() // values mapped by hash, hash-value pair

    this.get = (token) =>
    {
        /*
            switch which variable is used as key
            sacrificed minimal performance for convenience of use
            three getters depending on key type seemed like
            solution for edge cases
        */
        const type = typeof(token)
    	switch(type)
        {
            case "number": { return this.values.get(token) } //hash number directly
            case "object": { console.log(token); return this.values.get(token.hash()) } //hash
            case "string":
            {
                console.log(token)
                console.log(new Hash(token).hash())
                if (this.keys.has(token))
                    return this.values.get(this.keys.get(token))
                else
                    return this.values.get(new Hash(token))

            } //unhashed string
    	}
    }
    this.getByString = (string) => { return this.values.get(this.keys.get(string)) }
    this.getByHash = (key) => { return this.values.get(key) }
    this.getHash = (token) =>
    {
        /*
            gets hash value for provided string token
        */
        return this.keys.get(token)
    }
    this.getString = (token) =>
    {
        /*
            gets string for provided hash token
        */
        const type = typeof(token)
        if (type != "object") //number is more likely
            return this.strings.get(token)
        else
            return this.strings.get(token.hash())
    }
    this.set = (key, value) =>
    {
        /*
            generates hash, writes keys to maps for ease of access
            and in case only one type of token exists
        */
        const keyType = typeof(key)
        switch(keyType)
        {
            case "number": // key is int
            {
                if (this.values.has(key)) //if already presumably in the map
                    return false;

                //assigning only values because
                //there's no way to calculate string from hash number
                this.values.set(key, value)
                return key
                break
            }
            case "object": //key is hash
            {
                if (this.values.has(key.hash()))
                    return false

                this.strings.set(key.hash(), key.string())
                this.keys.set(key.string(), key.hash())
                this.values.set(key.hash(), value)
                return key.hash()
                break
            }
            case "string":
            {
                if (this.strings.has(key))
                    return false;

                const hash = new Hash(key)
                this.strings.set(hash.hash(), hash.string())
                this.keys.set(hash.string(), hash.hash())
                this.values.set(hash.hash(), value)

                return hash.hash()
            }
        }
    }
    this.del = (token) =>
    {
        /*
            entrius deletus
        */
        let key
        let string
        const type = typeof(token)
        switch(type)
        {
            case "number": { key = token, string = this.strings.get(token); break; }
            case "object": { key = token.hash(), string = token.string(); break; }
            case "string": { key = this.keys.get(token), string = token; break; }
        }

        console.log(key, string)

        if (string && this.keys.has(string))
            this.keys.delete(string)
        if (key && this.strings.has(key))
            this.strings.delete(key)
        if (key && this.values.has(key))
            this.values.delete(key)
    }
    this.has = (token) =>
    {
        let key
        let string
        const type = typeof(token)
        switch(type)
        {
            case "number": { return this.keys.has(token); break; }
            case "object": { return this.keys.has(token.get()); break; }
            case "string": { return this.strings.has(token); break; }
        }
    }


}

function De()
{
    /*
        it's short for the
        short console log. use if line number in console is not needed
        it messes with your line number in console. what, surprised?
    */
    this.bug = function()
    {
        console.log(...arguments)
    }
    this.style =
    {
        error: "background: #222 color: #ba5555"
    }
    return this
}

function Progress(loaded, total)
{
    /*
        progress object to count percentages and fractions for progress bars
    */
    this.loaded = loaded
    this.total = total

    this.getFraction = () =>
    {
        //fraction is rounded to 4 decimal places
        return +((this.loaded/this.total).toFixed(4))
    }

    this.getPercentage = () =>
    {
        //percentage is rounded to 2 decimal places
		return +( ( this.getFraction() * 100 ).toFixed(2) )
    }

    return this
}

function Connection(c)
{
    this.c = c

    this.send = (data) =>
    {
        this.c.send(data)
    }
    this.close = () =>
    {
        this.c.close()
    }
}

var de = new De() //de for that short .bug occasional use

function roll4it()
{
    /*
        main thing
    */
    let t = this //reference roundabout

    /*
        BASE FUNCTIONS
    */

    this.put = function(db, key, append)
    {
        /*
            database "db" puts "append" at key
            only objects to append
            usable in cases when default gets and shits don't apply
        */
        return new Promise( resolve => //promise to be able to call it sync with await
        {
            let response //to output modified object just in case
            t.db.upsert(key, (data) => //key bound at time of new *Function constructor call
            {
                data = {...data, ...append} //append to object in db
                return data //saves modified object to db
            }).then(() =>
            {
                resolve(response) //output modified object
            })
        })
    }
    this.get = function(db, key)
    {
        /*
            gets "key" from "db"
        */
        return new Promise((resolve) => //promise to be able to call it sync with await
        {
            t.db.get(key).then((response) => //key bound at time of new *Function constructor call
            {
                resolve(response) //output that object
            }).catch((e) =>
            {
                resolve(null) //want those short ifs
            })
        })
    }

    this.getRandomInt = function(min, max)
    {
        /*
            gets int between minimum and maximum
        */
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    this.base =
    {
        /*
        function constructors, need to be used with new prefix
        for example: put and get function constructors are used in "declares"
        */
        PutFunction: function(dbName) //put to object in db
        {
            /*
                puts object to db at path determined by "key"
            */
            return (key, append) =>
            {
                /*
                    return functions to cut on defining same functionality to different modules
                    data base name "dbName" is determined when constructed by modules
                */
                return new Promise( resolve => //promise to be able to call it sync with await
                {
                    let response //output modified object just in case
                    t[dbName].db.upsert(key, (data) => //key bound at constructor for redis-y use
                    {
                        data = {...data, ...append} //modify db object
                        return data //saves modified object to db
                    }).then(() =>
                    {
                        resolve(true) //output modified object just in case
                    })
                })
            }
        },
        GetFunction: function(dbName)
        {
            /*
                get object from db from path determined by "key"
            */
            return (key) =>
            {
                return new Promise((resolve) =>
                {
                    t[dbName].db.get(key).then((response) =>
                    {
                        resolve(response) //output that object
                    }).catch((e) =>
                    {
                        resolve(null) //want those short ifs when finds nothing
                    })
                })
            }
        },
        PushFunction: function(dbName)
        {
            /*
                push array to array at path determined by "key"
            */
            return (key, append) =>
            {
                return new Promise( resolve =>
                {
                    let response
                    t[dbName].db.upsert(key, (data) =>
                    {
                        try //because try does not cost untill it catches
                        {
                            data.list = [...data.list, ...append] //modify db object
                        }
                        catch(error) //dont care, it will catch only when char is empty
                        {
                            data.list = [...append] //modify db object
                        }
                        return data //saves modified object to db
                    }).then(() =>
                    {
                        resolve(response) //output modified object just in case
                    })
                })
            }
        },
        SpliceFunction: function(dbName)
        {
            /*
                removes matching "object" from array at "key"

            */
            return (key, object) =>
            {
                return new Promise( resolve =>
                {
                    let response
                    t[dbName].db.upsert(key, (data) =>
                    {
                        const index = data.list.indexOf(object) //get that element index
                        data.list = data.list.splice(index) //remove element at index
                        return data //saves modified object to db
                    }).then(() =>
                    {
                        resolve(response) //output modified object just in case
                    })
                })
            }
        },
        DeleteFunction: function(dbName)
        {
            /*
                deletes "key" from object
            */
            return (key) =>
            {
                return new Promise((resolve) =>
                {
                    t[dbName].db.get(key).then((response) =>
                    {
                        return t[dbName].db.remove(response)
                    }).then((response) =>
                    {
                        resolve(response) //output that object
                    }).catch((e) =>
                    {
                        resolve(null) //want those short ifs
                    })
                })
            }
        },
        ModifyFunction: function(dbName)
        {
            /*
                deletes "key" from object
            */
            return (key, modifyFunction) =>
            {
                return new Promise((resolve) =>
                {
                    t[dbName].db.get(key).then((response) =>
                    {
                        modifyFunction(response)
                        return response
                    }).then((response) =>
                    {
                        resolve(response) //output modified object
                    }).catch((e) =>
                    {
                        resolve(null) //want those short ifs
                    })
                })
            }
        },
        HorizontalScrollFunction: function(element, bar)
        {
            /*
                to use mouse scroll button to scroll horizontally on divs with overvlow: hidden
            */
            return function (event)
            {
                this.scroll( //define smooth scroll behavior if compatible
                {
                    left: 0,
                    top: 0,
                    behavior: 'smooth'
                })
                event.preventDefault() //prevent vertical scroll
                const modifier = 0.75 //event.deltaY returns (+/-)100 so we might want to modify that fixed value
                element.scrollLeft += (event.deltaY * modifier) //aply scroll

                //calculate percentage
                const percentage = Math.floor((element.scrollLeft / (element.scrollWidth - element.offsetWidth)) * 100)
                if (!isNaN(percentage)) //if divided by zero by any chance
                    bar.style.width = percentage + "%"
                else
                    bar.style.width = "0%"
            }
        }
    }

    /*
        DECLARES
    */
    this.loading = () =>
    {

    }

    /*
        SUBMODULES
    */
    this.user =
    {
        //init db for user info
        db: new PouchDB("user"),
        put: new this.base.PutFunction("user"),
        get: new this.base.GetFunction("user"),
        uuidLength: 3
    }
    this.user = {...this.user,
        /*
            append to user the lazy way
        */
        init: async () =>
        {
            let userInfo = await this.user.get("info")
            let settings = await this.settings.get("main")

            /*
            WHEN FRESH USER START
            */
            if (!userInfo) //when no userid
            {
                userInfo = await this.user.put("info", {id: uuidv4().slice(0, this.network.uuidLength)})
                const b = browserDetect()
                let bro =
                {
                    platform: b.mobile ? "mobile" : "embedded",
                    name: b.name,
                    system: b.os,
                    version: b.version,
                    versionNumber: b.versionNumber,
                }
                // bro.hash = new Hash(bro.platform + "-" + bro.system + "-" + bro.name).hash()
                await this.settings.put("main",
                {
                    client: { id: uuidv4().slice(0, this.user.uuidLength),
                        client: {id: settings.client.id, name: browser.name,
                            platform: browser.platform, system: browser.system}}
                })
            }

            /*
                LOADING USER
            */
            return true
        }
    }

    this.settings =
    {
        db: new PouchDB("settings"),
        put: new this.base.PutFunction("settings"),
        get: new this.base.GetFunction("settings")
    }

    /*
        CHARACTER MODULE
        includes charsheet and characters frame in welcome screen
    */
    this.character =
    {
        db: new PouchDB("character"),
        put: new this.base.PutFunction("character"),
        get: new this.base.GetFunction("character"),
        del: new this.base.DeleteFunction("character"),
        push: new this.base.PushFunction("character"),
        splice: new this.base.SpliceFunction("character"),
        emptyCards: [{name: "Austin Powers", background: "assets/img/character.card.backgrounds/0.webp"}],
        uuidLength: 3,
        init: async () =>
        {
            /*
                initializes stuff needed for character related stuff to work
            */

            //attach character creation click event
            let addButton = document.querySelector("characters buttons create")
            addButton.addEventListener("click", (event) =>
            {
                this.character.create()
            })

            /*
                LOAD CHARACTERS if exist
            */
            const chars = await this.character.get("characters")
            if (chars)
                this.character.load(chars)

            this.character.editor.init()

            /*
                LOAD GAMES
            */

            /*
                LOAD ASSETS
            */

            return true
        },
        uuid: async () =>
        {
            /*
                 //make sure no such uuid already exist in character db
            */
            let charID = uuidv4().slice(0, this.character.uuidLength) //we dont need full length uuid at the moment
            let potentialChar = await t.character.get(charID) //get char to check if char exists
            if (potentialChar)
                return t.character.uuid()
            return charID
        },
        create: async () =>
        {
            /*
                CREATE EMPTY CHARACTER
            */
            //get random premade character card
            let character = {...this.character.emptyCards[this.getRandomInt(0, this.character.emptyCards.length - 1)]}

            //create blank character
            let settings = await this.settings.get("main")
            character.clientID = settings.clientID
            character.id = await this.character.uuid()
            character.sheets = []

            //write locally
            await this.character.put(character.id, {...character})
            await this.character.push("characters", [character.id])

            //display that shit
            this.character.createCard({...character})

            return character
        },
        createCard:  (character) =>
        {
            /*
                CREATING CHARACTER CARD FOR DISPLAY AND INTERACTION
            */
            //create html elements
            let card = document.createElement("character")
            let name = document.createElement("name")

            //set html elements
            name.textContent = character.name
            let background = document.createElement("background")
            background.style.backgroundImage = `url(${character.background})`

            //on click editor opening event
            card.addEventListener("click", (event) =>
            {
                this.character.editor.open(character)
            })

            //slap that shit together
            card.appendChild(background)
            card.appendChild(name)
            document.querySelector("characters fabric").appendChild(card)
        },
        load: (chars) =>
        {
            /*
                loads characters from database
            */
            const keys = chars.list //TODO later

            keys.forEach(async key =>
            {
                const character = await this.character.get(key)
                this.character.createCard(character)
            })
        }
    }

    this.character.editor =
    {
        /*
            charachter sheet editor
            TODO later
        */
        element: null,
        init: () =>
        {
            //for reuse
            this.character.editor.element = document.querySelector("body editor")

            //attach click event
            document.querySelector("editor button[type='close']").addEventListener("click", (event) =>
            {
                this.character.editor.hide()
            })
        },
        display: () =>
        {
            this.character.editor.element.setAttribute("display", "flex")
        },
        hide: () =>
        {
            this.character.editor.element.setAttribute("display", "hidden")
        },
        open: async (character) =>
        {
            let char = await this.character.get(character.id)
            this.character.editor.display()

            //open charsheet
            //TODO later: different charsheets
            const info = await this.fetch({location: "assets/charsheets/classic/info.json"})
        }
    }

    this.game =
    {
        put: new this.base.PutFunction("game"),
        get: new this.base.GetFunction("game")
    }
    this.contact =
    {
        put: new this.base.PutFunction("contact"),
        get: new this.base.GetFunction("contact")
    }
    /*
        FUNCTIONS
    */
    this.init = async () =>
    {
        /*
            start initialization procedure
        */
        await this.user.init()
        await this.character.init()
        await this.network.init() //TODO: sometimes network init fires before user init finishes, no idea why

        //mouse scroll events
        let characters = document.querySelector("characters fabric"),
        games = document.querySelector("games fabric"),
        assets = document.querySelector("assets fabric")

        characters.addEventListener("wheel", new this.base.HorizontalScrollFunction(characters, characters.parentNode.querySelector("scroll bar")))
        games.addEventListener("wheel", new this.base.HorizontalScrollFunction(games, games.parentNode.querySelector("scroll bar")))
        assets.addEventListener("wheel", new this.base.HorizontalScrollFunction(assets, assets.parentNode.querySelector("scroll bar")))

        /*
            window.location.hash handler
        */
        //listen for hashchange event
        window.addEventListener("hashchange", (event) =>
        {
             this.path.load()
        })

        this.path.load() //parse current path string

        this.isRunning = true //we're guessing
    }

    this.path =
    {
        keys:
        {
            /*
                url keys predefinition for easy item/source identification
            */
            user: "user", char: "char",
            game: "game", junk: "junk",
            spot: "spot", beat: "beat",
            club: "club", page: "page",
            wire: "wire", post: "post"
        },
        base:
        {
            getSource:
            {
                user: async (user) =>
                {
                    console.log("%con user", 'color: #ffffff8f;', user)
                    //create new transaction
                    const transactionID = await this.network.uuid(this.network.transactions)
                    const transaction = {id: transactionID, userid: user,
                        clientid: await this.settings.get("main").clientID, message: "gimme", what: "your info"}
                    console.log(transaction);
                    //add transaction to transactions
                    //
                }
            }
        }
    }

    this.path = {...this.path,
        //url source key strings
        sources: [this.path.keys.user, this.path.keys.game, this.path.keys.club],
        //url item key strings to be obtained from paired sources
        items: [this.path.keys.char, this.path.keys.junk, this.path.keys.spot, this.path.keys.wire, this.path.keys.post],
        read: () => //reads windows.location.hash string into servicable chunks of information
        {
            let request = []  //will be assembled during this function
            let chunk = { from: [], what: [] } //will be shoved into request object during this function

            //parse
            const hashArray = window.location.hash.split("/")
            for (let i = 1, l = hashArray.length; i < l; i++)
            {
                // assign key value pair
                const key = hashArray[i]
                const value = hashArray[++i]

                if (!value)
                    continue;

                //assign next key value pair
                const nextKey = hashArray[i+1]
                const nextValue = hashArray[i+2]

                if (this.path.isSource(key)) //append to sources if key is source
                    chunk.from.push({name: key, value: value})
                else //append to items if item
                {
                    chunk.what.push({what: key, value: value})

                    if (this.path.isSource(nextKey)) //if source is found after item
                    {
                        //end the chunk and start new one
                        request.push(chunk)
                        chunk = { from: [], what: []}
                    }
                }

                if (!nextKey) //end of hash array ends the chunk
                    request.push(chunk)
            }

            return request
        },
        load: async () =>
        {
            /*
                TODO later
            */
            const path = this.path.read()
            /*
                path parameter determines source of data/target of request
                likely sources:
                    other user
                    game node
                    club node

                parameter determines type of data requested
                likely data:
                    char
                    junk
                    spot
                    wire
                    post
            */

            //set global keys
            let globals = []
            const last = path[path.length-1]
            if (last && last.what.length < 1)
                last.from.forEach(source =>
                {
                    globals.push(source)
                })

            /*
                there are 5 things to consider
                1. theres only an item - read from globals if present and from local
                2. source only - fetch source info
                3. source paired with item - fetch item from source
                4. multiple sources/items - repeat stuff
                5. globals read - if source read fails
            */
            //iterate request chunks
            for (let i = 0, l = path.length; i < l; i++)
            {
                const request = path[i]
                if (request.from.length < 1) // if request is missing sources
                {
                    if (globals.length == 0) // load from local if no globals
                    {
                        return
                    }
                    else //load from globals if present
                    {

                    }


                }

                //iterate sources
                request.from.forEach(async source =>
                {
                    console.log(source)
                    if (request.what.length > 0)

                        request.what.forEach(item => //item paired to source
                        {
                            console.log("item paired with source", {item, source})
                        })
                    else //only source is present, get source information
                    {
                        console.log("only source", source)

                        try //faster than if when doesnt fail
                        {
                            this.path.base.getSource[source.name](source.value)
                        } catch (e) {console.warn(e)}
                    }
                })

                // if no source is present but items exist
                if (request.from.length == 0 && request.what.length > 0)
                {
                    if (globals.length > 0) //read from globals
                    {

                    }
                    else //read local
                    {

                    }
                }

                console.log(request)
            }
        },
        isSource: (key) =>
        {
            return this.path.sources.includes(key)
        },
        isItem: (key) =>
        {
            return this.path.items.includes(key)
        }
    }

    this.cache = //caching assets locally
    {
        db: new PouchDB("cache"),
        put: new this.base.PutFunction("cache"),
        get: new this.base.GetFunction("cache")
    }

    this.network =
    {
        /*
            p2p communication and tracker registration
        */
        db: new PouchDB("network"),
        put: new this.base.PutFunction("network"),
        get: new this.base.GetFunction("network"),
        del: new this.base.DeleteFunction("network"),
        push: new this.base.PushFunction("network"),
        splice: new this.base.SpliceFunction("network"),
        connections: new HashMap(),
        transactions: new HashMap(),
        relations: new HashMap(),
        chunks: new PouchDB("chunks"),
        shortPlatformName: "roll4it",
        peerID: undefined,
        isRunning: false,
        peer: undefined,
        uuidLength: 3,
        initRetryInterval: 150,
        uuid: async (target) =>
        {
            /*
                 //make sure no such uuid already exist in target container
            */
            let id = uuidv4().slice(0, this.network.uuidLength) //we dont need full length uuid at the moment
            if (target.has(id))
                return t.network.uuid(target)
            return id
        },
        handlers: //event handlers for peer
        {
            peer: // for peerjs object
            {
                open: (id) => // peer.on(open)
                {
                     //actual peerjs id granted by server might be different from preferred
                     //TODO notify contacts when peerid changes
                    this.network.peerID = id
                    this.network.isRunning = true
                },
                close: (event) => { }, //set status n shit on closed peer
                disconnected: (event) => //reconnect on lost
                {
                    this.network.isRunning = false
                    console.log(event)
                    setTimeout(() => { try { this.network.peer.reconnect()} catch(e){} }, 5000)
                },
                connection: (connection) =>
                {
                    //generate unique id, add to active connections
                    connection.on("open", () => { this.network.handlers.connection.open(connection) } )

                    //remove connection, update contact status
                    connection.on("close", this.network.handlers.connection.close)
                    connection.on("error", this.network.handlers.connection.error)
                },
                call: (event) => { }, //TODO
                error: (event) => { this.network.handlers.peer.disconnected(event) }
            },
            connection: // for connection object
            {
                //generate unique id, add to active connections
                open: async (connection) => //connection.on(open)
                {
                    // things are coming in
                    connection.on("data", (data) =>
                    {
                        this.network.handlers.connection.data(connection, data)
                    })
                    connection.on("close", () =>
                    {
                        this.network.handlers.connection.cleanup(connection)
                        this.network.handlers.connection.close(connection)
                    })
                    connection.on("error", () =>
                    {
                        this.network.handlers.connection.cleanup(connection)
                        this.network.handlers.connection.error(connection)
                    })
                },
                data: async (connection, data) => //connection.on(data)
                {
                    console.log(connection)
                    console.log(data.message)
                    console.log(data)
                    try //minimally faster than iffing when most requests are valid
                    {
                        this.network.on[data.message](connection, data)
                    }
                    catch(erur) {} //drop invalid chunks
                },
                close: (event) => //connection.on(close)
                 { console.log(event) },
                error: (error) => //connection.on(error)
                 { console.log(error) },
                cleanup: (connection) => //remove leftovers
                {
                    console.log("ERUR")
                    console.log(connection)
                    this.network.connections.del(connection.connectionID)
                }
            }
        },
        on: //request data type differentiation to keep things simple
        {
            //handshaking
            hellothere: async (connection, data) =>
            {
                console.log("hello there")
                let user = data
                delete user.message //clean message out of data
                let c = this.network.connections.get(connection.peer)
                if (c)
                {
                    c.user = user
                    c.connected = false;
                }
                else
                    c = {user: user, connected: false, connection: connection}

                this.network.connections.set(connection.peer, c)

                const userInfo = await this.user.get("info")
                const settings = await this.settings.get("main")
                connection.send({message: "generalkenobi", user: {id: userInfo.id, client:
                                {id: settings.client.id, name: settings.client.browser.name,
                                platform: settings.client.browser.platform,
                                system: settings.client.browser.system}}})
            },
            generalkenobi: async (connection, data) =>
            {
                console.log("general kenobi")
                let user = data
                delete user.message //clean message out of data
                let c = this.network.connections.get(connection.peer)
                if (c)
                {
                    c.user = user
                    c.connected = false;
                }
                else
                    c = {user: user, connected: false, connection: connection}

                this.network.connections.set(connection.peer, c)
            },
            user: () =>
            {

            },
            charsheet: () =>
            {

            },
            image: () =>
            {

            },
            chunk: () =>
            {

            }
        },
        connect: (peerid) => //connect to peer id
        {
            return new Promise(async resolve =>
            {
                if (!this.network.isRunning)
                    resolve(false)
                let connection = this.network.peer.connect(peerid)

                connection.on("open", async () =>
                {
                    this.network.handlers.connection.open(connection)

                    const userInfo = await this.user.get("info")
                    const settings = await this.settings.get("main")
                    this.network.connections.set(peerid, {connected: false, connection: connection})

                    connection.send({message: "hellothere", user: {id: userInfo.id, client:
                                    {id: settings.client.id, name: settings.client.browser.name,
                                    platform: settings.client.browser.platform, system: settings.client.browser.system}}})
                    resolve(connection)
                })

                connection.on("error", (error) => //TODO something with double connection
                {
                    this.network.handlers.connection.error(connection)
                    console.log(error)
                    resolve(false)
                })

            })
        },
        send: (peerid, data) =>
        {
            console.log(peerid, data)
            const connection = this.network.connections.get(peerid);
            if (connection.connected)
                connection.connection.send(data)
        }
    }


    this.network.init = async () =>
    {
        //create peer id
        const userInfo = await this.user.get("info")
        const settings = await this.settings.get("main")

        //connect to tracker, obtain peer id. same as preferred if available
        this.network.peerID = this.network.shortPlatformName + "-" +
                            userInfo.id + settings.clientID
        console.log(this.network.peerID)

        this.network.online()
    }
    this.network.online = async () =>
    {
        this.network.peer = new Peer(this.network.peerID) //register me my preferred peerid
        //when server actually responds with registered peer id
        this.network.peer.on("open", this.network.handlers.peer.open)
        //connection event handler
        this.network.peer.on("connection", this.network.handlers.peer.connection)
        //call event handler
        this.network.peer.on("call", this.network.handlers.peer.call)
        //close event handler
        this.network.peer.on("close", this.network.handlers.peer.close)
        //disconnect event handler
        this.network.peer.on("disconnected", this.network.handlers.peer.disconnected)
        //error event handler
        this.network.peer.on("error", this.network.handlers.peer.error)
    }

    this.fetch = function(args)
    {
        /*
        fetches asset from cache
        if not in cache, fetches from location
        */
        return new Promise( async (resolve) =>
        {
            if (!args) // if no args, nothing to do
                resolve("ERROR: No arguments passed to fetch.")

            const cached = await this.cache.get(args.location) //checks cache presence
            if (cached && !args.skipCache && !args.update) //cached, not skipping, not forcing update
            {
                if (args.progress) //if progress function present, set 100%
                    args.progress(new Progress(1, 1))
                resolve(cached)
            }
            else
            {
                const req = new XMLHttpRequest()
                if (args.progress) //use progress function if present
                    req.onprogress = (event) =>
                    {
                        args.progress(new Progress(event.loaded, event.total))
                    }

                req.onreadystatechange = async () => //process response
                {
                    if (req.readyState === XMLHttpRequest.DONE)
                    {
                        const status = req.status
                        if (status === 0 || (status >= 200 && status < 400))
                        {
                            if (!args.skipCache || args.update) //not skipping cache, updating
                                await this.cache.put(args.location, { location: args.location, file: req.response })

                            resolve(req.response)
                        }
                        else
                        {
                            console.log('%c fetch() connection error.  ', de.style.error)
                            console.log(req)
                            resolve(undefined) //TODO much later error handling
                        }
                    }
                }
                if (args.type) //if response type present
                    req.responseType = args.type

                req.open("GET", args.location)
                req.send()
            }
        })
    }

    this.snag = function(args)
    {

    }

    /*
        EXECUTION
    */
    this.init()
}
