function roll4it()
{
    this.data = {},
    this.boot = async () =>
    {
        // init user
        this.init.user();
    },
    this.init =
    {
        user: async () =>
        {
            let userID = await db.user.get("userID");
            console.log(userID);
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
