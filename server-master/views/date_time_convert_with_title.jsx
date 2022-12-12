import React from "react";

const CreateAtWithTitle = (props) => {
  const createAt = timeConverter(props.record.params["create_at"]);
  return (
    <section class ="sc-dIsAE lcuJrN admin-bro_Box">
      <label class="sc-dlnjPT fyQNXW admin-bro_Label">CreateAt</label>
       {createAt}
      <div></div>
    </section>
  );
};

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    hour + ":" + min + ":" + sec + " " + date + " " + month + " " + year + " ";
  return time;
}
export default CreateAtWithTitle;
