class Notification {
  constructor(id, title, type, isRead, content, user_id,isNew, createAt) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.isRead = isRead;
    this.content = content;
    this.user_id = user_id;
    this.isNew = isNew;
    this.createAt = createAt;
  }
}

module.exports = Notification;
