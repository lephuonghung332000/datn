class MessageChat {
  constructor(id, chat_box_id, content, sendBy, image, create_at) {
    this.id = id;
    this.chat_box_id = chat_box_id;
    this.content = content;
    this.sendBy = sendBy;
    this.image = image;
    this.create_at = create_at;
  }
}

module.exports = MessageChat;
