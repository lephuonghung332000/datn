class Post {
  constructor(id, title,create_at,update_at, status,images,user_id,category_id,brand_id,address,price,description) {
          this.id = id;
          this.user_id = user_id;
          this.category_id = category_id;
          this.title = title;
          this.create_at = create_at;
          this.update_at = update_at;
          this.status = status;
          this.images = images;
          this.brand_id = brand_id;
          this.address = address;
          this.price = price;
          this.description = description
  }
}

module.exports = Post;
