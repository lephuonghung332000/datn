class Notification {
  constructor(id, post_id, list_user_id, content, type, createAt) {
    this.id = id;
    this.post_id = post_id;
    this.list_user_id = list_user_id;
    this.content = content;
    this.type = type;
    this.createAt = createAt;
  }
}

module.exports = Notification;
