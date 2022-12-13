import React from "react";

const Gender = (props) => {
  const gender = props.record.params["gender"] ? "Nam" : "Nữ";

  return (
    <section class="sc-dIsAE lcuJrN admin-bro_Box">
      <label class="sc-dlnjPT fyQNXW admin-bro_Label">Gender</label>
      <p>{gender}</p>
    </section>
  );
};

export default Gender;
