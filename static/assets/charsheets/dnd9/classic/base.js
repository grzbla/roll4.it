class CharacterElement extends HTMLElement
{
    constructor()
    {
        super()

        const shadow = this.attachShadow({mode: 'closed'})

        const image = document.createElement("div"),
                blurb = document.createElement("div"),
                name = document.createElement("div")



    }
}



class CharsheetAppearanceElement extends HTMLElement
{
    constructor()
    {
        super()

        const shadow = this.attachShadow({mode: 'closed'})

        const image = document.createElement("div"),
                blurb = document.createElement("div"),
                name = document.createElement("div")



    }
}

customElements.define('character-sheet', CharacterElement);
customElements.define('full-name', CharsheetAppearanceElement)
customElements.define('class-levels', CharacterElement)
customElements.define('origin-place', CharacterElement)
customElements.define('item-card', CharacterElement)
