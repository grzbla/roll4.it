import { grab, element } from "./system.js"

/*  CORE RPG HUB ELEMENT
    from which every custom element should inherit  */
class RPGHubElement extends HTMLElement
{
    /*  constructor with super() is required    */
    constructor()
    {
        super()
    }

    /*  attributeChangedCallback(name, oldValue, newValue)
        [    triggers when attribute is changed             ]
        [    or set for the first time while loading html   ]

        element.processElementAttribute(name, oldValue, newValue)
        [   contains attributeNameJunction branching:       ]

        [   responsible for launching                       ]
        {   proper function for separate attributes         }
        {   returns result if applicable                    }
        {   source attribute will return .json file         }

        this.processElement({name, result, oldValue, newValue})
        [   is declared in elements extending RPGHubElement ]
        [   contains element specific processing for        ]
        [   attribute change events, which include          ]
        [   first time html parse                           ]*/
    async attributeChangedCallback(name, oldValue, newValue)
    {
        const event = {
            name: name,
            oldValue: oldValue,
            newValue: newValue,
            progressCallback: this.progressCallback
        }

        const response = await element.processElementAttribute(event)

        if (response)
        {
            if(response[0] == "{")
                event.response = JSON.parse(response)
        }

        if (this.processElement)
            this.processElement(event)
    }

}


class CharacterSheetElement extends RPGHubElement
{
    /*
        CharacterSheetElement has three control attributes

        [   source is a link, idb path or base64 string     ]
        {   result is a .json file with character data      }

        [   language determines translation table if exists ]
        {   result is element reload with new locale        }

        [   system determines scripting and descriptions    ]
        {   result is element reload with new terminology   }
    */
    static get observedAttributes()
    {
        return ['source', 'language', 'system'];
    }

    constructor()
    {
        super()
    }

    processElement(event)
    {
        console.log("processElement", event)
    }

    progressCallback(progress)
    {
        console.log(progress)
    }

    /* getters and setters because i want that short
        element.property = value instruction instead
        of element.(get|set)Attribute */
    get source() { return this.getAttribute("source") }
    set source(v) { this.setAttribute("source", v) }
}



class FullNameElement extends HTMLElement
{
    constructor()
    {
        super()
    }
}
class CharacterExperienceElement extends HTMLElement { constructor() { super() } }
class OriginPlaceElement extends HTMLElement { constructor() { super() } }

class ItemCardElement extends HTMLElement { constructor() { super() } }

class PrimaryStatElement extends HTMLElement { constructor() { super() } }
class ArmorClassElement extends HTMLElement { constructor() { super() } }
class HitPointsElement extends HTMLElement { constructor() { super() } }
class AttackSkillElement extends HTMLElement { constructor() { super() } }

class ProficiencyBonusElement extends HTMLElement { constructor() { super() } }
class InitiativeScoreElement extends HTMLElement { constructor() { super() } }
class SpeedRatingElement extends HTMLElement { constructor() { super() } }

class CharacterOptionsElement extends HTMLElement { constructor() { super() } }
class RacialBonusesElement extends HTMLElement { constructor() { super() } }
class RacialOptionsElement extends HTMLElement { constructor() { super() } }
class ClassBonusesElement extends HTMLElement { constructor() { super() } }
class ClassOptionsElement extends HTMLElement { constructor() { super() } }
class SubclassBonusesElement extends HTMLElement { constructor() { super() } }
class SubclassOptionsElement extends HTMLElement { constructor() { super() } }
class SpellbookElement extends HTMLElement { constructor() { super() } }
class SpecialAbilitiesElement extends HTMLElement { constructor() { super() } }

class CashCarriedElement extends HTMLElement { constructor() { super() } }
class CurrencyStashedElement extends HTMLElement { constructor() { super() } }
class ValuablesStoredElement extends HTMLElement { constructor() { super() } }
class PersonalPropertiesElement extends HTMLElement { constructor() { super() } }
class AssetsOwnedElement extends HTMLElement { constructor() { super() } }

class ActiveFellowshipElement extends HTMLElement { constructor() { super() } }
class PotentialAlliesElement extends HTMLElement { constructor() { super() } }
class DefiniteEnemiesElement extends HTMLElement { constructor() { super() } }

customElements.define('character-sheet', CharacterSheetElement);

customElements.define('full-name', FullNameElement)
customElements.define('character-experience', CharacterExperienceElement)
customElements.define('origin-place', OriginPlaceElement)

customElements.define('item-card', ItemCardElement)

customElements.define('primary-stat', PrimaryStatElement)
customElements.define('armor-class', ArmorClassElement)
customElements.define('hit-points', HitPointsElement)
customElements.define('attack-skill', AttackSkillElement)

customElements.define('proficiency-bonus', ProficiencyBonusElement)
customElements.define('initiative-score', InitiativeScoreElement)
customElements.define('speed-rating', SpeedRatingElement)

customElements.define('character-options', CharacterOptionsElement)
customElements.define('racial-bonuses', RacialBonusesElement)
customElements.define('racial-options', RacialOptionsElement)

customElements.define('class-bonuses', ClassBonusesElement)
customElements.define('class-options', ClassOptionsElement)
customElements.define('subclass-bonuses', SubclassBonusesElement)
customElements.define('subclass-options', SubclassOptionsElement)

customElements.define('spell-book', SpellbookElement)
customElements.define('special-abilities', SpecialAbilitiesElement)

customElements.define('cash-carried', CashCarriedElement)
customElements.define('currency-stashed', CurrencyStashedElement)
customElements.define('valuables-stored', ValuablesStoredElement)
customElements.define('personal-properties', PersonalPropertiesElement)
customElements.define('assets-owned', AssetsOwnedElement)

customElements.define('active-fellowship', ActiveFellowshipElement)
customElements.define('potential-allies', PotentialAlliesElement)
customElements.define('definite-enemies', DefiniteEnemiesElement)
