class Chat {
  constructor(id, id_receiver, id_sender, create_at, post_id) {
    this.id = id;
    this.id_receiver = id_receiver;
    this.id_sender = id_sender;
    this.create_at = create_at;
    this.post_id = post_id;
  }
}

module.exports = Chat;
