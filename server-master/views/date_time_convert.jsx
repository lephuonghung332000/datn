import React from "react";

const CreateAt = (props) => {
  const createAt = timeConverter(props.record.params["create_at"]);
  return <p>{createAt}</p>;
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
    hour + ":" + min + ":" + sec + " "+date + " " + month + " " + year + " ";
  return time;
}
export default CreateAt;
