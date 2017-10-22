//-------------------------------------------------------------------------
// Customization
//-------------------------------------------------------------------------
var shortname = "ME6";
var saberColour = "FF00FF";
var laserColour = "FF00FF";
var spellColour = "FF00FF";
var bombColour = "FF00FF";
//-------------------------------------------------------------------------
// Me6
//-------------------------------------------------------------------------
Me6.Inherits(Player);
function Me6(name){
    this.Inherits(Player, name, null);
}
Me6.prototype.__act = function(){
    Player.prototype.__act.call(this);
}
