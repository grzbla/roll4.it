//load values and cached images

//attach events
document.querySelectorAll(".characterSheet div div").forEach(function(element)
{
    element.addEventListener("click", editCharacter);
});

function editCharacter(event)
{
    console.log(event.target);
}



//
