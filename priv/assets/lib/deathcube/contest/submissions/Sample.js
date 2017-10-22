//-------------------------------------------------------------------------
// Customization
//  - you can personalize your character by setting the following values
//-------------------------------------------------------------------------
var shortname = "NAME";
var saberColour = "Red";
var laserColour = "Blue";
var spellColour = "Purple";
var bombColour = "Orange";
//-------------------------------------------------------------------------
// Sample
//-------------------------------------------------------------------------
Sample.prototype = new Player();
Sample.prototype.constructor = Sample;
function Sample(name){
    Player.call(this, name);
}
Sample.prototype.__act = function(){
    Player.prototype.__act.call(this);
}
