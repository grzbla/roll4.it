async function starto()
{
    var system = new roll4it();
    console.log(system);

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
}

starto();
