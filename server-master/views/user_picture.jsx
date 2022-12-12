import React from "react";

const Image = (props) => {
  const url = `${props.record.params["avatar"]}`;
  return <img src={url} width={200} height={200} />
};

export default Image;
