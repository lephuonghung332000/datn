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

  return <>{user ? <div>{user.fullname}</div> : <p>loading...</p>}</>;
};

export default Name;
