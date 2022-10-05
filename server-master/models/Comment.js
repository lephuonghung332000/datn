class Comment {
  constructor(id, post_id, user_id, content, image, create_at, update_at) {
    this.id = id;
    this.post_id = post_id;
    this.user_id = user_id;
    this.content = content;
    this.image = image;
    this.create_at = create_at;
    this.update_at = update_at;
  }
}

module.exports = Comment;
