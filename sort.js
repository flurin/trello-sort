var Trello = require("node-trello");

var Settings = require("./settings.json");

var key = Settings.key;
var secret = Settings.secret;

// https://trello.com/1/authorize?key=KEY&name=Trello+Sorter&expiration=30days&response_type=token&scope=read,write
var token = Settings.token;

var boardId = Settings.boardId;
var listName = Settings.listName;

var t = new Trello(key, token);


t.get("/1/boards/" + boardId + "/lists/open", function(err, data) {
  if (err) throw err;
  
  var ids = Object.keys(data).filter(function(k){
    return data[k].name == listName;
  });
  
  if(ids.length > 0){
    var list = data[ids[0]]
    
    t.get("/1/lists/"+ list.id + "/cards?fields=name,pos,idMembersVoted", function(err, data){
      var sorted = [];
      
      var s = Object.keys(data).sort(function(a, b){
        return data[a].idMembersVoted.length - data[b].idMembersVoted.length;
      })
          
      for(var i=0; i < s.length; i++){
        var card = data[s[i]];
        
        t.put("/1/cards/"+card.id, {pos: s.length - i}, function(err, data){
          console.log(data);
        });
      }
      
    });
}
  
  
  
});
