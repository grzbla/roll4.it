import v4 from "./3rd/uuid/v4.js"

/*
    SHIT HERE IS SUPPOSED TO BE INITIALIZED FIRST
*/

//system paths
const path =
{
    user: "user.json",
    client: "client.json",
    home: "home"
}

//
const url =
{
    source:
    {
        icons: [..."🎓👻🃏👾🎭💺🗿🚸🐙🐍🐲🐫🌞🌝🌚🌜🌛⛄️👥👤🙇💩👽💀👹👺♠️♥️♣️♦️🐉🐇🐎🐓♦️♣️♥️♠️💯〽️🔱🔗🏪🚨💈⚠️🚥🚦🎫🚏🚧🎰📍🎭🎪🚩🎆🎇🎥🔮🔨🔧💴💵💰🔫🔪🚬🚪💊🔍🔦💡🔎🔑💸💳💶💷📝📊📈📉📇📆📅📋📜📁📂📖📚📒📕📔📓📙📘📗📖🔬🔭📰🎨🎬👾🃏🎴🀄️🎲🎱🎾🎯🏈⚽️🎳🏉⛳️🏆🏇🎣☕️🍵🍶🍼🍺🍻🍸🍹🍷🌰🌐🌀⚡️☀️⛅️☁️⭐️🌠🌌🌋🌏🌍🌎💬💭👓👑👒🎩💪👍👃👀🔥✨🌟💫💥"]
    },
    client:
    {
        icons: [..."0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣🔟🆕🆙🆒🚾♿️♨🚜🚌🚔🚊⛽️⛵️🚀⚓️✈️🚂🚁🏥🏠🏢⛪️💻📱🚿🛀🚽🍠🌳🍄"]
    },
    content:
    {
        icons: [..."0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣🔟🆕🆗🛂🛄🛅🅿️🚷🚳🚱🚯📵🔞📴💟💠©®™❓❗️⭕️❌♠️♥️♣️♦️✖️➕➖➗💯✔️☑️🔘🔗◼️🔲◻️🔳📍🎭🎪🏮⚠️💈🌅🌄🏰🏯⛺️🌆⛲️🌃🌇🎆🎑🎓🎌🎉🎋🔮💿📀📷📹📼💽💾🔊🔉🔈📺📻⏰⌚️🔑🔐🔒🔓🔋🚽💣📈📉📊📦📝📄📃📑📜📋📅📆📇📁📂✒️✏️📐✂️📎📔📓📙📘📗📒📚📖🎨🎬🔬🔭📰🎧🎼🎵🎶🎹🎻🎺🎷🎸🎮🎴🀄️🎲🎯🏈🏀⚽️🎾🏉🎳🏆☕️🍵🍶🍺🍻🍸🍹🍷🍼🍶🍵☕️🌠🌌🌋🌏🌁🌈🌊💎❤️💚💜💛💙💛💔"]
    }
}

const style =
{
    color1a: "white-space: break-spaces; color: rgba(255,137,134,1); text-shadow: rgba(255,137,134,1) 1px 0 12px",
    color1b: "white-space: break-spaces; color: rgba(242, 79, 79,1); text-shadow: rgba(242, 79, 79,1) 1px 0 12px",
    color1c: "white-space: break-spaces; color: rgba(206, 37, 27,1); text-shadow: rgba(206, 37, 27,1) 1px 0 12px",
    color1d: "white-space: break-spaces; color: rgba(155,  6,  2,1); text-shadow: rgba(155,  6,  2,1) 1px 0 12px",
    color1e: "white-space: break-spaces; color: rgba( 91,  2,  0,1); text-shadow: rgba( 91,  2,  0,1) 1px 0 12px",

    color2a: "white-space: break-spaces; color: rgba(255,204,134,1); text-shadow: rgba(255,204,134,1) 1px 0 12px",
    color2b: "white-space: break-spaces; color: rgba(239,169, 73,1); text-shadow: rgba(239,169, 73,1) 1px 0 12px",
    color2c: "white-space: break-spaces; color: rgba(206,129, 22,1); text-shadow: rgba(206,129, 22,1) 1px 0 12px",
    color2d: "white-space: break-spaces; color: rgba(155, 91,  2,1); text-shadow: rgba(155, 91,  2,1) 1px 0 12px",
    color2e: "white-space: break-spaces; color: rgba( 91, 53,  0,1); text-shadow: rgba( 91, 53,  0,1) 1px 0 12px",

    color3a: "white-space: break-spaces; color: rgba(106,151,189,1); text-shadow: rgba(106,151,189,1) 1px 0 12px",
    color3b: "white-space: break-spaces; color: rgba( 54,109,154,1); text-shadow: rgba( 54,109,154,1) 1px 0 12px",
    color3c: "white-space: break-spaces; color: rgba( 23, 83,133,1); text-shadow: rgba( 23, 83,133,1) 1px 0 12px",
    color3d: "white-space: break-spaces; color: rgba(  8, 58,100,1); text-shadow: rgba(  8, 58,100,1) 1px 0 12px",
    color3e: "white-space: break-spaces; color: rgba(  2, 33, 59,1); text-shadow: rgba(  2, 33, 59,1) 1px 0 12px",

    log: "white-space: break-spaces; color: #ffffff9f",
    warn: "white-space: break-spaces; color: #ffffff9f; text-shadow: yellow 2px 0 10px",
    error: "white-space: break-spaces; color: #ffffff9f; text-shadow: red 2px 0 10px",
    pop: "white-space: break-spaces; color: lightgreen; text-shadow: #aaa 2px 0 10px",
    stack: "white-space: break-spaces; color: #ffffff7f; text-shadow: #aaa 1px 0 12px",
    red: "white-space: break-spaces; color: red; text-shadow: red 1px 0 12px",
    yellow: "white-space: break-spaces; color: yellow; text-shadow: yellow 1px 0 12px",
    pink: "white-space: break-spaces; color: pink; text-shadow: pink 1px 0 12px",
    blue: "white-space: break-spaces; color: #8383d2; text-shadow: #8383d2 1px 0 12px"
}

export function uuid(length)
{
    //if (length is defined) ? get length long uuid :else get full uuid (no -'s)
    return length ? v4().replace("-", "").substring(0, length) : v4().replace("-", "")
}

export {path, style, url}
