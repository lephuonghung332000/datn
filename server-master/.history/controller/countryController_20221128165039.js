const Notification = require("../models/Notification");
const COUNTRY_BASE_URL = 'https://vapi.vnappmob.com/api/'
const getAllProvinces = async (req, res) => {
  try {

    request(`${COUNTRY_BASE_URL}province`,  (error, response, body) => {
      if(error) {
          // If there is an error, tell the user 
          return res
          .status(500)
          .json({ success: false, message: "Occur in server error" });
      }
      // Otherwise do something with the API data and send a response
      else {
          res.send(body)
      }
  });
    // const id = req.params.id;
    // const notifications = db.collection("notification").doc(id);
    // const data = await notifications.get();
    // const notificationsArray = [];
    // if (data.empty) {
    //   return res.status(200).json([]);
    // }
    // data.forEach((doc) => {
    //   const notification = new Notification(
    //     doc.id,
    //     doc.data().post_id,
    //     doc.data().list_user_id,
    //     doc.data().type,
    //     doc.data().content,
    //     doc.data().createAt
    //   );
    //   notificationsArray.push(notification);
    // });
    // return res.status(200).json(notificationsArray);






  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Occur in server error" });
  }
};

module.exports = {
  getAllProvinces,
};
