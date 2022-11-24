class Comment {
  constructor(id, post_id, user_id, content, create_at) {
    this.id = id;
    this.post_id = post_id;
    this.user_id = user_id;
    this.content = content;
    this.create_at = create_at;
  }
}

module.exports = Comment;
