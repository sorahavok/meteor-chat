Chats = new Mongo.Collection("chats");
ChatLog = new Mongo.Collection("chatlog");

if (Meteor.isClient) {
  // Setup Code
  var notInChat = "None";
  var user = "anonymous";

  Session.set("currentChat", notInChat);
  Session.set("user", user);
  
  // Events
  Template.body.events({
    "submit .new-chat": function(){

      var name = event.target.text.value;

      Chats.insert({
        name: name,
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
      currChat.people.push(user)
      Session.set("currentChat", currChat);
    },
  });

  Template.chat.events({
    "click .sendImg": function(event) {
      insertNewChat();
    }, 

    "keyup #chatInput" : function(event) {
      if(event.keyCode == 13) {
        insertNewChat();
      }
    },
  });

  // Helpers
  Template.body.helpers({
    avalableChats: function() {
      return Chats.find({});
    },
    chatCount: function() {
      return Chats.find({}).count();
    },
    inChat: function(){
      return notInChat !== Session.get("currentChat");
    },
  });

  Template.chat.helpers({
    currentChat: function() {
      return Session.get("currentChat").name;
    },
    chatEntries: function() {
      return ChatLog.find({"chat": Session.get("currentChat").name});
    },
    peopleInChat: function() {
      return Session.get("currentChat").people.length;
    },
  });

  Template.avalableChat.helpers({
    createTime: function() {
      return this.createdAt.toLocaleDateString() + ' ' + this.createdAt.toLocaleTimeString();
    },
  });

  Template.chatEntry.helpers({
    createTime: function() {
      return this.createdAt.toLocaleTimeString();
    },
    userLetter: function() {
      return this.user[0].toUpperCase();
    },
  });

  var insertNewChat = function() {
    chatInput = $('#chatInput')[0];

    ChatLog.insert({
      text: chatInput.value,
      user: Session.get("user"),
      chat: Session.get("currentChat").name,
      createdAt: new Date(),
    });
    chatInput.value = "";
  };

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

  if (Meteor.isServer) {
    Meteor.startup(function () {
    // code to run on server at startup
  });
  }
