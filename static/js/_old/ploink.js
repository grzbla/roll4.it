let $ = undefined
function starto()
{
    $ = new roll4it()

    $.test = async () =>
    {
        let classes = {}
        let file = await (await fetch("data/5e.tools/class/index.json")).json()

        for (name in file)
        {
            let classFile = await (await fetch("data/5e.tools/class/" + file[name])).json()
            classes = Object.assign({}, classes, classFile)
        }

        // const ass = await $.fetch({location: "assets/kaylo_raps.mp4", progress: (progress) =>
        // {
        //     de.bug(progress)
        // }, type: "blob"})
        // de.bug(ass ? true : false)
        // console.log(ass)
        await $.fetch({location: "ass.fuck"})
    }

    $.test()
}

starto()
