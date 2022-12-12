import React from "react";

const CreateAt = (props) => {
  const birthday = timeConverter(props.record.params["birthday"]);
  return (
    <section class="sc-dIsAE lcuJrN admin-bro_Box">
      <label class="sc-dlnjPT fyQNXW admin-bro_Label">Birth day</label>
      <div>{birthday}</div>
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
  var time = date + " " + month + " " + year + " ";
  return time;
}
export default CreateAt;
