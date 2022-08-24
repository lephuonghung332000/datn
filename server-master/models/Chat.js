const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChatSchema = new Schema({
    idClient1: {
        type: String,
        require: true,
    },
    idClient2: {
        type:  String,
        require: true,
    },
    listChat: [
        {
             sendBy:{                                                                                 
                type: String,
                require: false,  
            },
            content: {
                type: String,
                require: false,
            },
            image: [
                {
                    file: {
                        type: String,
                        require: false,
                    },
                }
            ],
            createAt: {
                type: Date,
                default: Date.now,
            },
        }
      ],
});

const Chat = mongoose.model("chats", ChatSchema);

module.exports = Chat;
