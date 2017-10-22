//-------------------------------------------------------------------------
// Customization
//-------------------------------------------------------------------------
var shortname = "ME5";
var saberColour = "00FFFF";
var laserColour = "00FFFF";
var spellColour = "00FFFF";
var bombColour = "00FFFF";
//-------------------------------------------------------------------------
// Me5
//-------------------------------------------------------------------------
Me5.Inherits(Player);
function Me5(name){
    this.Inherits(Player, name, null);
}
Me5.prototype.__act = function(){
    Player.prototype.__act.call(this);
}
