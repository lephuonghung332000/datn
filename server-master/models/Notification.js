class Notification {
  constructor(id, title, type, isRead, content, user_id,isNew, create_at) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.isRead = isRead;
    this.content = content;
    this.user_id = user_id;
    this.isNew = isNew;
    this.create_at = create_at;
  }
}

module.exports = Notification;
