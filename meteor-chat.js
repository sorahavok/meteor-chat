Chats = new Mongo.Collection("chats");

if (Meteor.isClient) {
  var notInChat = "None";
  var anon = "anonymous";

  Session.set("currentChat", currChat);
  Session.set("user", anon);
  Template.body.events({
    "submit .new-chat": function(event){

      var text = event.target.text.value;

      Chats.insert({
        name: text,
        createdAt: new Date(),
        people: [],
      });

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    },

    "click .chat-item": function(event) {
      currChat = Chats.findOne({"name": event.target.innerText});
      currChat.people.push(anon)
      Session.set("currentChat", currChat);
    }
  });

  Template.body.helpers({
    avalableChats: function() {
      return Chats.find({});
    },
    chatCount: function() {
      return Chats.find({}).count();
    },
    inChat: function(){
      return notInChat !== Session.get("currentChat");
    }
  });

  Template.chat.helpers({
    currentChat: function() {
      return Session.get("currentChat").name;
    },
    chatlog: function() {
      return ChatLog.find({"name": Session.get("currentChat").name});
    },
    peopleInChat: function() {
      return Session.get("currentChat").people.length;
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
