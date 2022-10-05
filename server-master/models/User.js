class User {
  constructor(id, name, fullname, email,
      birthday, file, phone, address, gender,role,fcmTokens) {
          this.id = id;
          this.name = name;
          this.fullname = fullname;
          this.email = email;
          this.birthday = birthday;
          this.file = file;
          this.phone = phone;
          this.address = address;
          this.gender = gender;
          this.role = role;
          this.fcmTokens = fcmTokens;
  }
}

module.exports = User;
