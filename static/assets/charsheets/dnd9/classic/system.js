/*
    PROGRESS HELPER OBJECT
*/
function Progress(loaded, total)
{
    /*
        progress object to count percentages and fractions for progress bars
    */
    this.loaded = loaded
    this.total = total

    this.getFraction = () =>
    {
        //fraction is rounded to 4 decimal places
        return +((this.loaded/this.total).toFixed(4))
    }

    this.getPercentage = () =>
    {
        //percentage is rounded to 2 decimal places
		return +( ( this.getFraction() * 100 ).toFixed(2) )
    }

    return this
}

function Junction()
{
    this.map = new Map()
    for (const i in arguments)
    {
        const functions = arguments[i]
        for (const name in functions)
        {
            const func = functions[name]
            this.map.set(name, func)
        }
    }

    this.set = (name, func) =>
    {
        this.map.set(name, func)
    }

    this.get = (name, arg) =>
    {
        return new Promise( async resolve =>
        {
            try
            {
                resolve(this.map.get(name)(arg))
            }
            catch (e) { }
            finally { resolve(undefined) }
        })
    }

    return this
}

function grab(args)
{
    /*
        fetches asset from cache
        if not in cache, fetches from target location
    */
    return new Promise( (resolve) =>
    {
        if (!args && !args.target) // if no args, nothing to do
            resolve("ERROR: No arguments passed to fetch.")

        const req = new XMLHttpRequest()
        if (args.progress) //use progress function if present
            req.onprogress = (event) =>
            {
                args.progress(new Progress(event.loaded, event.total))
            }

        req.onreadystatechange = () => //process response
        {
            if (req.readyState === XMLHttpRequest.DONE)
            {
                const status = req.status
                if (status === 0 || (status >= 200 && status < 400))
                {
                    resolve(req.response)
                }
                else
                {
                    console.log('%c fetch() connection error.  ', de.style.error)
                    console.log(req)
                    resolve(undefined) //TODO much later error handling
                }
            }
        }
        if (args.type) //if response type present
            req.responseType = args.type
        else
            req.responseType = "text"

        req.open("GET", args.target)
        req.send()
    })
}


/*
    RPGHubElement helper object to unclutter rpghub.js element extends
*/

function Element()
{
    /*      *        *       *
        OBTAIN SOURCE DATA
    */
    this.getSource = function(protocol, source, event)
    {
        return new Promise(async resolve =>
        {
            try
            {
                resolve(await element.protocolJunction.get(protocol, event))
            }
            catch(e) {console.log(e); resolve(undefined)}

        })
    }

    /*  attributeNameJunction
        [   splits code into branches based on attribute name string    ]
        [   source attribute r]
    */
    this.attributeNameJunction = new Junction(
    {
        //process source attribute
        source: (event) =>
        {
            return new Promise( async resolve =>
            {
                event.protocol = event.newValue.substring(0, 4)
                const data = await this.getSource(event.protocol, event.newValue, event)

                if (data)
                    resolve(data)
                else
                {
                    resolve(undefined)
                    console.log("data empty")

                }
            })
        },
        language: () => {}
    })

    /*
        SOURCE PROTOCOL JUNCTION
    */
    this.protocolJunction = new Junction(
    {
        "idb:": (event) =>
        {
            // read
            console.log(event)
        },
        "http": (event) =>
        {
            return new Promise( async (resolve) =>
            {
                const response = await grab({target: event.newValue, progress: event.progress})
                resolve(response)
            })
        },
        "data": (source) =>
        {
            //parse
            const {type, data} = source.split(",")
            console.log(type, data)
        }
    })

    this.processElementAttribute = function(event)
    {
        return new Promise( async resolve =>
        {
            try
            {
                resolve(await element.attributeNameJunction.get(event.name, event))
            }
            catch (e) {console.log(e)}
        })
    }


    return this;
}

const element = new Element()

export { grab, element }
