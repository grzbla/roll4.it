function starto()
{
    var system = new roll4it();

    system.test = async function()
    {
        let classes = {};
        let file = await (await fetch("data/5e.tools/class/index.json")).json();

        for (name in file)
        {
            let classFile = await (await fetch("data/5e.tools/class/" + file[name])).json();
            classes = Object.assign({}, classes, classFile)
        }

        const ass = await da.fetch("assets/kaylo_raps.mp4", (progress) =>
        {
            de.bug(progress);
        }, "arraybuffer");
        de.bug(ass ? true : false);

        await da.fetch("ass.fuck");
    };

    system.test();
};

starto();
