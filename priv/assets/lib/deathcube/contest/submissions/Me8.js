//-------------------------------------------------------------------------
// Customization
//-------------------------------------------------------------------------
var shortname = "ME8";
var saberColour = "F010A0";
var laserColour = "F010A0";
var spellColour = "F010A0";
var bombColour = "F010A0";
//-------------------------------------------------------------------------
// Me8
//-------------------------------------------------------------------------
Me8.Inherits(Player);
function Me8(name){
    this.Inherits(Player, name, null);
}
Me8.prototype.__act = function(){
    Player.prototype.__act.call(this);
}
