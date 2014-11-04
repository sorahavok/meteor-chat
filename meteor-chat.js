Chats = new Mongo.Collection("chats");

if (Meteor.isClient) {
  var notInChat = "None";
  var anon = "anonymous";
  Session.set("currentChat", notInChat);
  Session.set("user", anon);
  Template.body.events({
    "submit .new-chat": function(event){

      var text = event.target.text.value;

      Chats.insert({
        name: text,
        createdAt: new Date(),
        people: Session.get("user")
      });

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    }
  });

  Template.chat.helpers({
    currentChat: function() {
      return Session.get("currentChat");
    }
  })

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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
