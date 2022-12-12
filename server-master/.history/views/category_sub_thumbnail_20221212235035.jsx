import React from "react";

const Image = (props) => {
  const url = `${props.record.params["sub_thumbnail"]}`;
  return <img src={url} width={150} height={150} />
};

export default Image;
