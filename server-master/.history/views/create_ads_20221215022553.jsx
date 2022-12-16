import React, { useState } from "react";
import { useNotice } from "admin-bro";

const style = {
  height: 30,
};

const CreateAds = (props) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const sendNotice = useNotice();

  const onUpload = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleSubmit = (e) => {
    const data = new FormData(e.target);
    data.append("file", selectedImage);

    handlerCreateAds(data, sendNotice);
  };

  return (
    <div>
      <form class="sc-dIsAE khLjzP admin-bro_Box" onSubmit={handleSubmit}>
        <section class="sc-lbVuaH jEbEsB">
          <section
            data-testid="property-edit-title"
            class="sc-dIsAE fbPpRS admin-bro_Box"
          >
            <div class="sc-gXfWUo eXXQLh">
              <label for="title" class="sc-dlnjPT jymcNI admin-bro_Label">
                Title
              </label>
              <input
                id="title"
                name="title"
                class="sc-iqAbSa iZwEPv admin-bro_Input"
              />
              <div class="sc-jrsJCI sc-cBoprd bJANQE cTfPTZ admin-bro_Text"></div>
            </div>
          </section>
          <div style={style}></div>
          <section
            data-testid="property-edit-url"
            class="sc-dIsAE fbPpRS admin-bro_Box"
          >
            <div class="sc-gXfWUo eXXQLh">
              <label for="url" class="sc-dlnjPT jymcNI admin-bro_Label">
                Url
              </label>
              <input
                id="url"
                name="url"
                class="sc-iqAbSa iZwEPv admin-bro_Input"
              />
              <div class="sc-jrsJCI sc-cBoprd bJANQE cTfPTZ admin-bro_Text"></div>
            </div>
          </section>
          <div style={style}></div>
          <section
            data-testid="property-edit-image"
            class="sc-dIsAE fbPpRS admin-bro_Box"
          >
            <div>
              <form>
                <div>
                  {selectedImage && (
                    <div>
                      <img
                        alt="not fount"
                        id="image"
                        name="image"
                        width={"250px"}
                        src={URL.createObjectURL(selectedImage)}
                      />
                      <br />
                      <button onClick={() => setSelectedImage(null)}>
                        Remove
                      </button>
                    </div>
                  )}
                  <br />

                  <br />
                  <input
                    type="file"
                    name="file"
                    onChange={(event) => onUpload(event)}
                  />
                </div>
              </form>
            </div>
          </section>
          <div style={style}></div>
          <section
            data-testid="property-edit-content"
            class="sc-dIsAE fbPpRS admin-bro_Box"
          >
            <div class="sc-gXfWUo eXXQLh">
              <label for="content" class="sc-dlnjPT jymcNI admin-bro_Label">
                Content
              </label>
              <input
                id="content"
                name="content"
                class="sc-iqAbSa iZwEPv admin-bro_Input"
              />
              <div class="sc-jrsJCI sc-cBoprd bJANQE cTfPTZ admin-bro_Text"></div>
            </div>
          </section>
        </section>
        <section class="sc-hhIhEF eqWAhy">
          <button
            type="submit"
            data-testid="button-save"
            class="sc-gtssRu KUrOd admin-bro_Button"
          >
            Save
          </button>
        </section>
      </form>
    </div>
  );
};

const handlerCreateAds = async (form, sendNotice) => {
  try {
    window.opener = null;

    // const options = {
    //   method: "POST",
    //   url: `http://localhost:5000/api/ads/addAds`,
    //   data: form,
    //   headers: { "Content-Type": "multipart/form-data" },
    // };
    // await axios(options);
  
    window.open("http://localhost:5000/admin/resources/advertising");
    window.close();
    sendNotice({ message: "Send success", type: "success" });
  } catch (error) {
    sendNotice({ message: "Send error", type: "error" });
  }
};

export default CreateAds;
