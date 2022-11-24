class User {
  constructor(id, name, fullname, email,
      birthday, avatar, phone, address, gender,role,fcmTokens,create_at) {
          this.id = id;
          this.name = name;
          this.fullname = fullname;
          this.email = email;
          this.birthday = birthday;
          this.avatar = avatar;
          this.phone = phone;
          this.address = address;
          this.gender = gender;
          this.role = role;
          this.fcmTokens = fcmTokens;
          this.create_at = create_at;
  }
}

module.exports = User;
