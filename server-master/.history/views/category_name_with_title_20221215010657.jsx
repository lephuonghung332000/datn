import React, { useState, useEffect } from "react";

const CategoryNameWithTitle = (props) => {
  const [catetory, setCategory] = useState();

  useEffect(() => {
    const init = async () => {
      const options = {
        method: "GET",
        url: `http://classifiedadvertising.herokuapp.com/api/category`,
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
        <section class ="sc-dIsAE lcuJrN admin-bro_Box">
          <label class="sc-dlnjPT fyQNXW admin-bro_Label">Category</label>
          <p>{`${catetory.name}`}</p>
        </section>
      ) : (
        <p>loading...</p>
      )}
    </>
  );
};

export default CategoryNameWithTitle;
