import React from "react";

const Gender = (props) => {
  const gender = props.record.params["gender"] ? "Nam" : "Nữ";

  return <div>{gender}</div>;
};

export default Gender;
