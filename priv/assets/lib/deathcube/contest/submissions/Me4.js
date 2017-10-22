//-------------------------------------------------------------------------
// Customization
//-------------------------------------------------------------------------
var shortname = "ME4";
var saberColour = "FFFF00";
var laserColour = "FFFF00";
var spellColour = "FFFF00";
var bombColour = "FFFF00";
//-------------------------------------------------------------------------
// Me4
//-------------------------------------------------------------------------
Me4.Inherits(Player);
function Me4(name){
    this.Inherits(Player, name, null);
}
Me4.prototype.__act = function(){
    Player.prototype.__act.call(this);
}
