//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//  Code for adventure game
// 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function getScript(path){
    var request = new XMLHttpRequest();  
    request.open('GET', path, false);
    request.send();
    return request.responseText;
}

const STATE_MAKE_BRACKETS       = 1;
const STATE_START_BRACKET       = 2;
const STATE_END_BRACKET         = 3;
const STATE_NEXT_ROUND          = 4;
const STATE_COMPLETE            = 5;

const BRACKET_OPTIMAL_MIN       = 4;
const BRACKET_OPTIMAL_MAX       = 6;
const BRACKET_OPTIMAL_ADV       = 2;
const BRACKET_FINAL_ADV         = 1;

const TIME_LIMIT                = 150000;

function BracketData(){
    this.players    = [];
    this.winners    = [];
}
BracketData.prototype.addPlayer = function(newPlayer){
    this.players.push(newPlayer);
}
BracketData.prototype.countPlayers = function(){
    return this.players.length;
}
BracketData.prototype.getPlayers = function(){
    return this.players;
}
BracketData.prototype.setWinners = function(winners){
    for(var i = 0; i < winners.length; i++){
        var winner = winners[i];
        for(var j = 0; j < this.players.length; j++){
            if(this.players[j][0] == winner){
                this.winners.push(this.players[j]);
                break;
            }
        }
    }
}
BracketData.prototype.getWinners = function(){
    return this.winners;
}

function BDataAssembler(data){
    data.__proto__ = BracketData.prototype;
    for(var property in BracketData.prototype){
        data[property] = BracketData.prototype[property];
    }
}

function RoundData(participants){
    if(participants == null){
        participants = [];
    }
    this.players    = participants; // array of [name, level] pairs
    this.brackets    = [];
    this.currBrkt     = -1;
}
RoundData.prototype.shufflePlayers = function(){
    var playersInRound = this.players;
    for(var i = 0; i < playersInRound.length; i++){
        var j = Math.floor(Math.random()*playersInRound.length);
        var temp = playersInRound[i];
        playersInRound[i] = playersInRound[j];
        playersInRound[j] = temp;
    }
}
RoundData.prototype.optimalDiv = function(){
    var playersInRound     = this.players;
    var optimalRemDist     = Number.MAX_VALUE;
    var optimalDiv         = BRACKET_OPTIMAL_MIN;    
    for(var i = BRACKET_OPTIMAL_MIN; i <= BRACKET_OPTIMAL_MAX; i++){
        var rem            = (playersInRound.length % i);
        var remDist        = Number.MAX_VALUE;
        for(var j = BRACKET_OPTIMAL_MIN; j <= BRACKET_OPTIMAL_MAX; j++){
            remDist = Math.min(remDist, Math.abs(j - rem));
        }
        if(remDist < optimalRemDist){
            optimalRemDist = remDist;
            optimalDiv = i;
        }
        if(optimalRemDist == 0){
            break;
        }
    }
    return optimalDiv;
}
RoundData.prototype.makeBrackets = function(){
    this.shufflePlayers();
    var div = this.optimalDiv();
    this.brackets.length = 0;
    var newBracket = new BracketData();
    var playersInRound     = this.players;
    for(var i = 0; i < playersInRound.length; i++){
        newBracket.addPlayer(playersInRound[i]);
        if(newBracket.countPlayers() == div){
            this.brackets.push(newBracket);
            newBracket = new BracketData();
        }
    }
    if(newBracket.countPlayers() > 0){
        this.brackets.push(newBracket);
    }
    this.currBrkt = -1;
}
RoundData.prototype.getCurrentBracket = function(){
    return this.brackets[this.currBrkt];
}
RoundData.prototype.nextBracket = function(){
    this.currBrkt++;
    return this.getCurrentBracket();
}
RoundData.prototype.bracketsDone = function(){
    return (this.currBrkt == this.brackets.length-1);
}
RoundData.prototype.isFinalRound = function(){
    return (this.brackets.length == 1);
}
RoundData.prototype.collectWinners = function(){
    var winners = [];
    for(var i = 0; i < this.brackets.length; i++){
        winners = winners.concat(this.brackets[i].getWinners());
    }
    return winners;
}

function RDataAssembler(data){
    data.__proto__ = RoundData.prototype;
    for(var property in RoundData.prototype){
        data[property] = RoundData.prototype[property];
    }
    for(var i = 0; i < data.brackets.length; i++){
        BDataAssembler(data.brackets[i]);
    }
}

function TournamentData(){
    this.state     = STATE_MAKE_BRACKETS;
    this.rounds     = [];
}
TournamentData.prototype.addRound = function(participants){
    this.rounds.push(new RoundData(participants));
}
TournamentData.prototype.getCurrentRound = function(){
    return this.rounds[this.rounds.length-1];
}
TournamentData.prototype.getCurrentRoundNum = function(){
    return this.rounds.length-1;
}
TournamentData.prototype.getState = function(){
    return this.state;
}
TournamentData.prototype.setState = function(newState){
    this.state = newState;
}

function TDataAssembler(data){
    data.__proto__ = TournamentData.prototype;
    for(var property in TournamentData.prototype){
        data[property] = TournamentData.prototype[property];
    }
    for(var i = 0; i < data.rounds.length; i++){
        RDataAssembler(data.rounds[i]);
    }
}

function Tournament(){
    this.data = null;
    this.initialize();
}
Tournament.prototype.initialize = function(){
    this.load();
    if(this.data == null){
        this.data = new TournamentData();
        this.data.addRound(PARTICIPANTS);
    }
    this.save();
}
Tournament.prototype.save = function(){
    localStorage.setItem("tournament", JSON.stringify(this.data));
}
Tournament.prototype.load = function(){
    var data = localStorage.getItem("tournament");
    if(data != null){
        data = JSON.parse(data);
        TDataAssembler(data);
    }
    this.data = data;
}
Tournament.prototype.nextState = function(newState){
    this.data.setState(newState);
    var tournament = this;
    setTimeout(function(){ tournament.run(); }, 500);
}
Tournament.prototype.run = function(){
    this.save();
    var state = this.data.getState();
    switch(state){
        case STATE_MAKE_BRACKETS:
            this.data.getCurrentRound().makeBrackets();
            this.nextState(STATE_START_BRACKET);
            break;
        case STATE_START_BRACKET:
            var currBracket = this.data.getCurrentRound().nextBracket();
            this.startGame(currBracket);
            break;
        case STATE_END_BRACKET:
            if(this.data.getCurrentRound().bracketsDone()){
                this.nextState(STATE_NEXT_ROUND);
            }else{
                this.nextState(STATE_START_BRACKET);
            }
            break;
        case STATE_NEXT_ROUND:
            if(this.data.getCurrentRound().isFinalRound()){
                this.nextState(STATE_COMPLETE);
            }else{
                this.data.addRound(this.data.getCurrentRound().collectWinners());
                this.nextState(STATE_MAKE_BRACKETS);
            }
            break;
        case STATE_COMPLETE:
            var winners = this.data.getCurrentRound().collectWinners();
            var announcement = "";
            if(winners.length > 1){
                announcement = "The champions are: ";
                for(var i = 0; i < winners.length; i++){
                    announcement = announcement +=  winners[i][0] + " ";
                }
            }else{
                announcement = "The champion is: " + winners[0][0];
            }
            alert("The tournament is complete!\n"+announcement);
            break;
    }
}
Tournament.prototype.startGame = function(bracket){
    var currRndNum = this.data.getCurrentRoundNum();
    if(currRndNum >= ROUND_LAYOUTS.length){
        eval(getScript("lib/Deathcube/contest/layouts/"+DEFAULT_LAYOUT));
    }else{
        eval(getScript("lib/Deathcube/contest/layouts/"+ROUND_LAYOUTS[currRndNum]));
    }
    
    var engine = new DeathCubeEngine(CONT_MODE, LAYOUT);
    LAYOUT = null;
    
    var players = bracket.getPlayers();
    for(var i = 0; i < players.length; i++){
            eval(getScript("lib/Deathcube/contest/submissions/"+players[i][0]+".js"));
            eval("var newPlayer = new "+players[i][0]+"('"+shortname+"');");
            RegisterPlayer(newPlayer, players[i][1], engine, 
                           saberColour, laserColour, spellColour, bombColour);
    }
    
    var tournament = this;
    var toAdvance = BRACKET_OPTIMAL_ADV;
    if(this.data.getCurrentRound().isFinalRound()){
        toAdvance = BRACKET_FINAL_ADV;
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
                bracket.setWinners(engine.__getWinners(toAdvance));
                tournament.nextState(STATE_END_BRACKET);
                engine.__exit();
                engine = null;
            }
        )
    );
    var startTime = (new Date()).getTime();
    engine.__addEndGame(
        new EndGame(
            function(){
                var currTime = (new Date()).getTime();
                return (currTime - startTime) >= TIME_LIMIT;
            },
            function(){
                alert("Fall back! This attack run has taken too long! We'd best retreat for now...");
                bracket.setWinners(engine.__getWinners(toAdvance));
                tournament.nextState(STATE_END_BRACKET);
                engine.__exit();
                delete engine;
            }
        )
    );
    engine.__start();
}

localStorage.clear(); // for local testing
var tournament = new Tournament();
tournament.run();
