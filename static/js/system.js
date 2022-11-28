function Hash(string)
{
    /*
        constructor for an object containing both hash and string
        gets passed by reference so its likely faster than string
        same speed as passing hash alone, but at the cost of couple bytes
    */
    this.string = string

    this.set = (string) =>
    {
        this.string = string
        this.hash = new MurmurHash3("string").result()
    }

    return this
}

function HashMap()
{
    /*
        it's a hash map. thats it
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
            case "number": { return valuesMap.get(token) }
            case "object": { return valuesMap.get(token.hash) }
            case "string": { return valuesMap.get(stringsMap.get(token)) }
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
            return this.strings.get(token.hash)
    }
    this.set = (string, value) =>
    {
        /*
            generates hash, writes keys to maps for ease of access
        */
        if (!this.keys.has(string))
        {
            const key = MurmurHash3(string).result()
            this.strings.set(key, string)
            this.keys.set(string, key)
            this.values.set(key, value)
            return key
        }
        else
        {
            return false
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
            case "number": { key = token, string = stringsMap.get(token); break; }
            case "object": { key = token.hash, string = token.string; break; }
            case "string": { key = stringsMap.get(token), string = token; break; }
        }

        this.values.delete(key)
        this.strings.delete(key)
        this.keys.delete(string)
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
    this.user =
    {
        //init db for user info
        db: new PouchDB("user"),
        put: new this.base.PutFunction("user"),
        get: new this.base.GetFunction("user")
    }
    this.user = {...this.user,
        /*
            append to user the lazy way
        */
        init: async () =>
        {
            let user = await this.user.get("info")
            let settings = await this.settings.get("main")

            /*
            WHEN FRESH USER START
            */
            if (!user) //when no userid
            {
                user = await this.user.put("info", {id: uuidv4()})
                const browser = browserDetect()

                await this.settings.put("main",
                {
                    clientID: uuidv4(),
                    browser:
                    {
                        platform: browser.mobile ? "mobile" : "embedded",
                        name: browser.name,
                        system: browser.os,
                        version: browser.version,
                        versionNumber: browser.versionNumber
                    }
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
            let charID = uuidv4().slice(0, 4) //we dont need full length uuid at the moment
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

    this.network =
    {
        /*
            p2p communication and tracker registration
        */
        responder: new HashMap(),
        messages: new HashMap(),
        connections: new HashMap(),
        on:
        {
            open: (id) => { console.log('confirming peer ID: ' + id) }
        },
        connect: async (peerid) =>
        {
            /*
                connect to peer
            */
            let connection = peer.connect(peerid)
            return this.network.connections.set(peerid, connection)
        },
        receive: async (connection) =>
        {
            /*
                receive connection
            */
            connection.on('data', (message) => { responder.get(message.hash)(message); });
            return this.network.connections.set(peerid, peer.connect(peerid))
        },
        disconnect: async (peerid) =>
        {
            /*
                disconnect from peer
            */
            this.network.connections.get(peerid).disconnect()
            return this.network.connections.del(peerid)
        },
        send: (peerid, message) =>
        {
            /*
                send message
            */
            this.network.connection.get(peerid).send(message)
        },
        getPeerID: async () =>
        {
            const userInfo = await this.user.get("info")
            const settings = await this.settings.get("main")
            return userInfo.id + "|" + settings.clientID + "|" +
                settings.browser.name + "-" + settings.browser.system
        }
    }


    this.network.init = () =>
    {
        /*
            TODO now
        */
        const shortPlatformName = "roll4it"

        this.network.peeri = new Peeri(this.network.getPeerID, {"open": this.network.on.open})

        this.network.messages.set("add me bro", (message) =>
        {
            //add me bro
        });
        this.network.responder.set("add me bro", (message) =>
        {
            //adding bro
        });
    },

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
        this.network.init()

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

        this.status = "Assumed ON." //we're guessing
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
    }

    this.path = {...this.path, ...{
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

                //assign next key value pair
                const nextKey = hashArray[i+1]
                const nextValue = hashArray[i+2]

                if (this.path.isSource(key)) //append to sources if key is source
                    chunk.from.push({key: key, value: value})
                else //append to items if item
                {
                    chunk.what.push({key: key, value: value})

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
        load: () =>
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

            path.forEach(request =>
            {
                console.log(request)
            })
        },
        isSource: (key) =>
        {
            return this.path.sources.includes(key)
        },
        isItem: (key) =>
        {
            return this.path.items.includes(key)
        }
    }}

    this.cache = //caching assets locally
    {
        db: new PouchDB("cache"),
        put: new this.base.PutFunction("cache"),
        get: new this.base.GetFunction("cache")
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

    this.init()
}
