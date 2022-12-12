import React from "react";

const Image = (props) => {
  const url = `${props.record.params["thumbnail"]}`;
  return <img src={url} width={150} height={150} />
};

export default Image;
