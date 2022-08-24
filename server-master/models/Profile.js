const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProfileSchema = new Schema({
  fullName: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    default: ""
  },
  address: {
    type: String,
    default: ""
  },
  phone: {
    type: String,
    default: ""

  },
  birthday: {
    type: String,
    default: ""
  },
  tokenFcm: {
    type: String,
    default: ""
  },
  listProductRequire:
    [
      {
        type: String,
        require: false,
      }
    ],
  listFriends:
    [
      {
        type: String,
        require: false,
      }
    ],
  user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
  numberPro: {
    type: Number,
    default: 0
  }
});

const Profile = mongoose.model("profiles", ProfileSchema);

module.exports = Profile;
