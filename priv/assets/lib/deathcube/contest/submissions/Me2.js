//-------------------------------------------------------------------------
// Customization
//-------------------------------------------------------------------------
var shortname = "ME2";
var saberColour = "00FF00";
var laserColour = "00FF00";
var spellColour = "00FF00";
var bombColour = "00FF00";
//-------------------------------------------------------------------------
// Me2
//-------------------------------------------------------------------------
Me2.Inherits(Player);
function Me2(name){
    this.Inherits(Player, name, null);
}
Me2.prototype.__act = function(){
    Player.prototype.__act.call(this);
}
