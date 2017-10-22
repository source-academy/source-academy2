//-------------------------------------------------------------------------
// Customization
//-------------------------------------------------------------------------
var shortname = "ME7";
var saberColour = "000000";
var laserColour = "000000";
var spellColour = "000000";
var bombColour = "000000";
//-------------------------------------------------------------------------
// Me7
//-------------------------------------------------------------------------
Me7.Inherits(Player);
function Me7(name){
    this.Inherits(Player, name, null);
}
Me7.prototype.__act = function(){
    Player.prototype.__act.call(this);
}
