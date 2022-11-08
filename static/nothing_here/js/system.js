function roll4it()
{
    this.data = {},
    this.boot = async () =>
    {
        // init user
        this.user.init();
    },
    this.user =
    {
        get: async () =>
        {
            this.data.userID = await db.user.get("userID");
            return (this.data.userID ? true : false);
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
