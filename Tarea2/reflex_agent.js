// MIT License
// Copyright (c) 2020 Luis Espino
// Modified by Sergio Guoz

var arrayStates=[false,false,false,false,false,false,false,false];


function random_dirty() {
   var rand=Math.floor(Math.random() * 3);
   if(rand==1)states[1]="DIRTY";
   else if(rand==2)states[2]="DIRTY";
   else{
      states[1]="DIRTY"; 
      states[2]="DIRTY";
   }
}

function are_all_states_completed() {
   for (var i = 0; i < arrayStates.length; i++) {
      if(!arrayStates[i]) return false;
   }
   return true;
}

function fillState(states){
   let index=0;
   if(states[0]=="A"&&states[1]=="DIRTY"&&states[2]=="DIRTY")index=0;
   else if(states[0]=="A"&&states[1]=="CLEAN"&&states[2]=="DIRTY")index=1;
   else if(states[0]=="B"&&states[1]=="CLEAN"&&states[2]=="DIRTY")index=2;
   else if(states[0]=="B"&&states[1]=="CLEAN"&&states[2]=="CLEAN")index=3;
   else if(states[0]=="A"&&states[1]=="CLEAN"&&states[2]=="CLEAN")index=4;
   else if(states[0]=="A"&&states[1]=="DIRTY"&&states[2]=="CLEAN")index=5;
   else if(states[0]=="B"&&states[1]=="DIRTY"&&states[2]=="CLEAN")index=6;
   else if(states[0]=="B"&&states[1]=="DIRTY"&&states[2]=="DIRTY")index=7;

   if(!arrayStates[index]){
      document.getElementById("log").innerHTML+="<br>&nbsp;<span style='color:gray'>&nbsp;State: ".concat(index+1)
      .concat("->").concat(" Location is: ").concat(states[0])
      .concat(" | A is: ").concat(states[1]).concat(" | B is: ").concat(states[1]).concat("</span>");
   }
   arrayStates[index]=true;
   return index;
}

function reflex_agent(location, state){
   	if (state=="DIRTY") return "CLEAN";
   	else if (location=="A") return "RIGHT";
   	else if (location=="B") return "LEFT";
}

function test(states){
   	var location = states[0];		
   	var state = states[0] == "A" ? states[1] : states[2];
      var index = fillState(states);
   	var action_result = reflex_agent(location, state);
   	document.getElementById("log").innerHTML+="<br>Location: ".concat(location).concat(" | Action: ").concat(action_result);
   	if (action_result == "CLEAN"){
     	   if (location == "A") states[1] = "CLEAN";
      	else if (location == "B") states[2] = "CLEAN";
   	}
   	else if (action_result == "RIGHT") states[0] = "B";
   	else if (action_result == "LEFT") states[0] = "A";

   if (!are_all_states_completed()) {
      setTimeout(function(){ test(states); }, 2000);
   }else{
      document.getElementById("log").innerHTML+="<br><span style='color:#D32408'>Ha pasado por los 8 estados! </span>";
   }		
}

var states = ["A","DIRTY","DIRTY"];
setInterval(function(){ random_dirty(); }, 6000);
test(states);