import React, { useState, useEffect } from "react";

const CategoryName = (props) => {
  const [catetory, setCategory] = useState();

  useEffect(() => {
    const init = async () => {
      const options = {
        method: "GET",
        url: `https://classifiedadvertising.herokuapp.com/api/category`,
      };
      const _catetories = await axios(options);
      const _category = _catetories.data.data.find(function (e) {
        return e.id == props.record.params["category_id"];
      });
      setCategory(_category);
    };
    init();
  }, [props.record.params["category_id"]]);

  return (
    <>
      {catetory ? (
        <div>
          <p>{`${catetory.name}`}</p>
        </div>
      ) : (
        <p>loading...</p>
      )}
    </>
  );
};

export default CategoryName;
