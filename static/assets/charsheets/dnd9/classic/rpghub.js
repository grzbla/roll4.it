import { test } from "./system.js"


class CharacterSheetElement extends HTMLElement
{
    constructor()
    {
        super()

        test(this)
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
