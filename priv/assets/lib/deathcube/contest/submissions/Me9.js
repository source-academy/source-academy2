//-------------------------------------------------------------------------
// Customization
//-------------------------------------------------------------------------
var shortname = "ME9";
var saberColour = "112233";
var laserColour = "112233";
var spellColour = "112233";
var bombColour = "112233";
//-------------------------------------------------------------------------
// Me9
//-------------------------------------------------------------------------
Me9.Inherits(Player);
function Me9(name){
    this.Inherits(Player, name, null);
}
Me9.prototype.__act = function(){
    Player.prototype.__act.call(this);
}
