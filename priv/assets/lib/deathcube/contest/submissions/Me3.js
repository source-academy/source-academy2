//-------------------------------------------------------------------------
// Customization
//-------------------------------------------------------------------------
var shortname = "ME3";
var saberColour = "0000FF";
var laserColour = "0000FF";
var spellColour = "0000FF";
var bombColour = "0000FF";
//-------------------------------------------------------------------------
// Me3
//-------------------------------------------------------------------------
Me3.Inherits(Player);
function Me3(name){
    this.Inherits(Player, name, null);
}
Me3.prototype.__act = function(){
    Player.prototype.__act.call(this);
}
