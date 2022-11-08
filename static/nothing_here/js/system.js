function roll4it()
{
    let t = this;
    this.db = new PouchDB("settings");

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

    this.base =
    {
        PutFunction: function(key) //we're using key to "upsert" and "append" to what's already in db
        {
            return (append) =>
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
            }
        },
        GetFunction: function(key) //need that key for upsert
        {
            return () =>
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
        }
    };

    /*
        DECLARES
    */
    this.user =
    {
        put: new this.base.PutFunction("user"),
        get: new this.base.GetFunction("user")
    };

    this.settings =
    {
        put: new this.base.PutFunction("settings"),
        get: new this.base.GetFunction("settings")
    };

    this.characters =
    {
        put: new this.base.PutFunction("characters"),
        get: new this.base.GetFunction("characters")
    };
    this.games =
    {
        put: new this.base.PutFunction("games"),
        get: new this.base.GetFunction("games")
    };
    this.contacts =
    {
        put: new this.base.PutFunction("contacts"),
        get: new this.base.GetFunction("contacts")
    };
    /*
        FUNCTIONS
    */
    this.boot = async () =>
    {
        // if user get true > init(), else generate user(first time boot)
        this.user.init();
    };

    this.user = {...this.user,
        //write minimum user data for this to work
        init: async () =>
        {
            /*
                FRESH START
            */
            let user = await this.user.get();
            let settings = await this.settings.get();
            if (!user) //when no userid
            {
                user = await this.user.put({id: uuidv4()});
                settings = await this.settings.put({machineID: uuidv4()});
            }

            /*
                LOADING USER
            */
            console.log(user, settings);
        }
    }
};

//

system = new roll4it();
system.boot();

system.test = async function()
{
    let classes = {};
    let file = await (await fetch("./nothing_here/data/5e.tools/class/index.json")).json();

    for (name in file)
    {
        let classFile = await (await fetch("./nothing_here/data/5e.tools/class/" + file[name])).json();
        classes = Object.assign({}, classes, classFile)
    }
    // console.log(classes)
};

system.test();
