import React from "react";

const Image = (props) => {
  const url = `${props.record.params["image"]}`;
  return <img src={url} width={200} height={200} />
};

export default Image;
