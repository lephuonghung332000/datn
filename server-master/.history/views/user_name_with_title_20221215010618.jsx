import React, { useState, useEffect } from "react";

const Name = (props) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const init = async () => {
      const user_id = props.record.params["user_id"];
      const options = {
        method: "GET",
        url: `http://classifiedadvertising.herokuapp.com/api/user/${user_id}`,
      };
      const result = await axios(options);
      setUser(result.data.data);
    };
    init();
  }, [props.record.params["user_id"]]);

  return (
    <>
      {user ? (
        <section class="sc-dIsAE lcuJrN admin-bro_Box">
          <label class="sc-dlnjPT fyQNXW admin-bro_Label">User</label>
          <p>{user.fullname}</p>
        </section>
      ) : (
        <p>loading...</p>
      )}
    </>
  );
};

export default Name;
