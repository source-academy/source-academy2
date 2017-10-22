function test_contest(player_list) {
	var engine = new DeathCubeEngine(CONT_MODE, LAYOUT_CONTEST);
	while (!is_empty_list(player_list)) {
		var player_data = head(player_list);
		var player = head(player_data);
		var saberColour = head(tail(player_data));
		var laserColour = head(tail(tail(player_data)));
		var spellColour = head(tail(tail(tail(player_data))));
		var bombColour = head(tail(tail(tail(tail(player_data)))));
		RegisterPlayer(player, 30, engine, 
							   saberColour, laserColour, spellColour, bombColour);
		player_list = tail(player_list);
   }
	engine.__addEndGame(
        new EndGame(
            function(){
                var things = Room.__genRoom.getThings();
                while(!is_empty_list(things)){
                    var thing = head(things);
                    if(thing instanceof Generator){
                        return thing.__isDestroyed();
                    }
                    things = tail(things);
                }
                return true;
            },
            function(){
                alert("Congratulations! The generator has been destroyed!");
                engine.__exit();
            }
        )
    );
    var startTime = (new Date()).getTime();
	var TIME_LIMIT = 500000;
    engine.__addEndGame(
        new EndGame(
            function(){
                var currTime = (new Date()).getTime();
                return (currTime - startTime) >= TIME_LIMIT;
            },
            function(){
                alert("Fall back! This attack run has taken too long! We'd best retreat for now...");
                engine.__exit();
            }
        )
    );
    engine.__start();
	return engine;
}