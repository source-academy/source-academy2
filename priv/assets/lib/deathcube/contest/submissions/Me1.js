//-------------------------------------------------------------------------
// Customization
//-------------------------------------------------------------------------
var shortname = "ME1";
var saberColour = "FF0000";
var laserColour = "FF0000";
var spellColour = "FF0000";
var bombColour = "FF0000";
//-------------------------------------------------------------------------
// Me1
//-------------------------------------------------------------------------
Me1.Inherits(Player);
function Me1(name){
    this.Inherits(Player, name, null);
}
Me1.prototype.__act = function(){
    Player.prototype.__act.call(this);
}
