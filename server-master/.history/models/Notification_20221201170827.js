class Notification {
  constructor(id, title, type, isRead, content, createAt) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.isRead = isRead;
    this.content = content;
    this.createAt = createAt;
  }
}

module.exports = Notification;