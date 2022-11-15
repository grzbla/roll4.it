function roll4it()
{
    let t = this;
    /*
        BASE FUNCTIONS
    */

    this.put = function(key, append)
    {
        return new Promise( resolve => //promise to be able to call it sync with await
        {
            let response; //output modified object just in case
            t.db.upsert(key, (data) => //key bound at time of new *Function constructor call
            {
                data = {...data, ...append}; //modify db object
                response = data; //save modified object for output
                // console.log(response);
                return data; //saves modified object to db
            }).then(() =>
            {
                resolve(response); //output modified object just in case
            });
        });
    };

    this.get = function(key) //no param because key already provided during construction
    {
        return new Promise((resolve) => //promise to be able to call it sync with await
        {
            t.db.get(key).then((response) => //key bound at time of new *Function constructor call
            {
                // console.log(response);
                resolve(response); //output that object
            }).catch((e) =>
            {
                resolve(null); //want those short ifs
            });
        })
    };

    /*
        function constructors, need to be used with new prefix
        for example: put and get function constructors are used in "declares"
    */
    this.base =
    {
        PutFunction: function(dbName) //we're using key to "upsert" and "append" to what's already in db
        {
            return (key, append) =>
            {
                return new Promise( resolve => //promise to be able to call it sync with await
                {
                    let response; //output modified object just in case
                    t[dbName].db.upsert(key, (data) => //key bound at time of new *Function constructor call
                    {
                        data = {...data, ...append}; //modify db object
                        response = data; //save modified object for output
                        // console.log(response);
                        return data; //saves modified object to db
                    }).then(() =>
                    {
                        resolve(response); //output modified object just in case
                    });
                });
            }
        },
        GetFunction: function(dbName) //need that key for upsert
        {
            return (key) =>
            {
                return new Promise((resolve) => //promise to be able to call it sync with await
                {
                    t[dbName].db.get(key).then((response) => //key bound at time of new *Function constructor call
                    {
                        // console.log(response);
                        resolve(response); //output that object
                    }).catch((e) =>
                    {
                        resolve(null); //want those short ifs
                    });
                })
            };
        },
        HorizontalScrollFunction: function(element, bar)
        {
            return (event) =>
            {
                event.preventDefault();
                element.scrollLeft += event.deltaY;

                const percentage = Math.floor(element.scrollLeft / (element.scrollWidth - element.offsetWidth) * 100);
                if (!isNaN(percentage))
                    bar.style.width = percentage + "%";
                else
                    bar.style.width = "0%";
            };
        }
    };

    /*
        DECLARES
    */
    this.user =
    {
        db: new PouchDB("user"),
        put: new this.base.PutFunction("user"),
        get: new this.base.GetFunction("user")
    };

    this.settings =
    {
        db: new PouchDB("settings"),
        put: new this.base.PutFunction("settings"),
        get: new this.base.GetFunction("settings")
    };

    /*
        CHARACTER MODULE
        includes charsheet and characters frame in welcome screen
    */
    this.character =
    {
        db: new PouchDB("character"),
        put: new this.base.PutFunction("character"),
        get: new this.base.GetFunction("character"),
        emptyCards: [{name: "Austin Powers", background: "./nothing_here/assets/img/character.card.backgrounds/0.webp"}],

        init: () =>
        {
            let addButton = document.querySelector("characters buttons create");
            addButton.addEventListener("click", (event) =>
            {
                this.character.create();
            });

            return true;
        },
        uuid: async () =>
        {
            let charID = uuidv4();
            let potentialChar = await t.character.get(charID); //get char to check if exists
            if (potentialChar)
                return t.character.uuid();
            return charID;
        },
        /*
            CREATE EMPTY CHARACTER
        */
        create: async () =>
        {
            let character = {};
            let settings = await this.settings.get("main");

            character.machineID = settings.machineID;
            character.id = await this.character.uuid();

            //save to db
            await this.character.put(character.id, {...character});

            //display that shit
            this.character.createCard({...this.character.emptyCards[0], id: character.id});

            return character;
        },
        /*
            CREATING CHARACTER CARD FOR DISPLAY AND INTERACTION
        */
        createCard:  (character) =>
        {
            let card = document.createElement("character");
            let name = document.createElement("name");
            name.textContent = character.name;
            let background = document.createElement("background");
            background.style.backgroundImage = `url(${character.background})`;

            card.addEventListener("click", (event) =>
            {
                this.character.edit(character);
            });

            card.appendChild(background);
            card.appendChild(name);
            document.querySelector("characters editor").appendChild(card);
        },

        edit: async (character) =>
        {
            let char = await this.character.get(character.id);
            console.log(char);

            // open system selector

            // open edition selector


        }
    };
    this.game =
    {
        put: new this.base.PutFunction("game"),
        get: new this.base.GetFunction("game")
    };
    this.contact =
    {
        put: new this.base.PutFunction("contact"),
        get: new this.base.GetFunction("contact")
    };
    /*
        FUNCTIONS
    */
    this.boot = async () =>
    {
        // if user get true > init(), else generate user(first time boot)
        console.log(await this.user.init());
        console.log(this.character.init());

        //add events

        let characters = document.querySelector("characters editor"),
        games = document.querySelector("games editor"),
        assets = document.querySelector("assets editor");

        characters.addEventListener("wheel", new this.base.HorizontalScrollFunction(characters, characters.parentNode.querySelector("scroll bar")));
        games.addEventListener("wheel", new this.base.HorizontalScrollFunction(games, games.parentNode.querySelector("scroll bar")));
        assets.addEventListener("wheel", new this.base.HorizontalScrollFunction(assets, assets.parentNode.querySelector("scroll bar")));
        this.status = "Assumed ON.";
    };

    this.user = {...this.user,
        //write minimum user data for this to work
        init: async () =>
        {
            /*
                FRESH START
            */
            let user = await this.user.get("info");
            let settings = await this.settings.get("main");

            if (!user) //when no userid
            {
                user = await this.user.put("info", {id: uuidv4()});
                settings = await this.settings.put("main", {machineID: uuidv4()});
            }

            /*
                LOADING USER
            */
            return true;
        }
    };

    this.boot();
};
