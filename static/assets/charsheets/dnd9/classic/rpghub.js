import { test } from "./system.js"


class CharacterSheetElement extends HTMLElement
{
    constructor()
    {
        super()

        test()
    }
}



class FullNameElement extends HTMLElement { constructor() { super() } }
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

customElements.define('full-name', EmptyElement)
customElements.define('character-experience', EmptyElement)
customElements.define('origin-place', EmptyElement)

customElements.define('item-card', EmptyElement)

customElements.define('primary-stat', EmptyElement)
customElements.define('armor-class', EmptyElement)
customElements.define('hit-points', EmptyElement)
customElements.define('attack-skill', EmptyElement)

customElements.define('proficiency-bonus', EmptyElement)
customElements.define('initiative-score', EmptyElement)
customElements.define('speed-rating', EmptyElement)

customElements.define('character-options', EmptyElement)
customElements.define('racial-bonuses', EmptyElement)
customElements.define('racial-options', EmptyElement)
customElements.define('class-bonuses', EmptyElement)
customElements.define('class-options', EmptyElement)
customElements.define('subclass-bonuses', EmptyElement)
customElements.define('subclass-options', EmptyElement)
customElements.define('spell-book', EmptyElement)
customElements.define('special-abilities', EmptyElement)

customElements.define('cash-carried', EmptyElement)
customElements.define('currency-stashed', EmptyElement)
customElements.define('valuables-stored', EmptyElement)
customElements.define('personal-properties', EmptyElement)
customElements.define('assets-owned', EmptyElement)

customElements.define('active-fellowship', EmptyElement)
customElements.define('potential-allies', EmptyElement)
customElements.define('definite-enemies', EmptyElement)
