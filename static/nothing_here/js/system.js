function roll4it()
{
    this.data = {},
    this.boot = async () =>
    {
        // if user get true > init(), else generate user(first time boot)
        this.user.get() ? this.user.init() : this.user.create();
        this.user.init();
    },
    this.user =
    {
        get: async () =>
        {
            this.data.userID = await db.user.get("userID");
            return (this.data.userID ? true : false);
        },
        create: async () =>
        {
            this.userID = uuidv4();
            this.machineID = uuidv4();
        },
        init: async () =>
        {
            console.log(this.data);
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
    console.log(classes)
};

system.test();
