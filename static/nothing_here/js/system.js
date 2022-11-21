function De()
{
    this.bug = function()
    {
        console.log(...arguments);
    }
    return this;
}

var de = new De();


function roll4it()
{
    let t = this;
    /*
        BASE FUNCTIONS
    */

    this.put = function(db, key, append)
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

    this.get = function(db, key) //no param because key already provided during construction
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

    this.getRandomInt = function(min, max)
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
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
            return function (event)
            {
                this.scroll(
                {
                    left: 0,
                    top: 0,
                    behavior: 'smooth'
                });
                event.preventDefault();
                element.scrollLeft += (event.deltaY * 0.33);

                const percentage = Math.floor((element.scrollLeft / (element.scrollWidth - element.offsetWidth)) * 100);
                if (!isNaN(percentage))
                    bar.style.width = percentage + "%";
                else
                    bar.style.width = "0%";
            }
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


            this.character.editor.init();
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
            let character = {...this.character.emptyCards[this.getRandomInt(0, this.character.emptyCards.length - 1)]};
            let settings = await this.settings.get("main");

            character.machineID = settings.machineID;
            character.id = await this.character.uuid();

            //write locally
            await this.character.put(character.id, {...character});

            //display that shit
            this.character.createCard({...character});

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
                this.character.editor.open(character);
            });

            card.appendChild(background);
            card.appendChild(name);

            document.querySelector("characters fabric").appendChild(card);
        }

    };


    this.character.editor =
    {
        element: null,
        init: () =>
        {
            this.character.editor.element = document.querySelector("body editor");
            document.querySelector("editor button[type='close']").addEventListener("click", (event) =>
            {
                this.character.editor.hide();
            });
        },
        display: () =>
        {
            this.character.editor.element.setAttribute("display", "flex");
        },
        hide: () =>
        {
            this.character.editor.element.setAttribute("display", "hidden");
        },
        open: async (character) =>
        {
            let char = await this.character.get(character.id);

            this.character.editor.display();

            // 0 sheets mean character is freshly created and user needs to select charsheet
            if (char.sheets.length == 0)
            {

            }

            //open charsheet
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
        await this.user.init();
        await this.character.init();

        //add events
        let characters = document.querySelector("characters fabric"),
        games = document.querySelector("games fabric"),
        assets = document.querySelector("assets fabric");

        characters.addEventListener("wheel", new this.base.HorizontalScrollFunction(characters, characters.parentNode.querySelector("scroll bar")));
        games.addEventListener("wheel", new this.base.HorizontalScrollFunction(games, games.parentNode.querySelector("scroll bar")));
        assets.addEventListener("wheel", new this.base.HorizontalScrollFunction(assets, assets.parentNode.querySelector("scroll bar")));
        this.status = "Assumed ON.";


    };

    this.user = {...this.user,
        //write minimum user data for this to work
        init: async () =>
        {
            let user = await this.user.get("info");
            let settings = await this.settings.get("main");

            /*
            WHEN FRESH USER START
            */
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
