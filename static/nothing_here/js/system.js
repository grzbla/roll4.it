function roll4it()
{
    this.boot = async () =>
    {
        /*
            FETCH TABLE OF CONTENTS
        */
        let toc = await (await fetch("./static.json")).json();
        console.log(toc);

        /*
            CREATE LOADING
        */
    },
    this.display =
    {
        loading: async () =>
        {

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
