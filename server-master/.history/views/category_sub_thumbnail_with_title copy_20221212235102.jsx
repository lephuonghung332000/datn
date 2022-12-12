import React from "react";

const Image = (props) => {
  const url = `${props.record.params["sub_thumbnail"]}`;
  return (
    <section class="sc-dIsAE lcuJrN admin-bro_Box">
      <div id="container">
        <div id="viewport">
          <label class="sc-dlnjPT fyQNXW admin-bro_Label">Sub Thumbnail</label>
          <img src={url} width={200} height={200} />
        </div>
      </div>
    </section>
  );
};

export default Image;
