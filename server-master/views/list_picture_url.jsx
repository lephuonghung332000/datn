import React, { useState, useEffect } from "react";

import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
} from "react-virtualized";

const columnWidth = 250;
const defaultHeight = 260;
const defaultWidth = columnWidth;

const cache = new CellMeasurerCache({
  defaultHeight,
  defaultWidth,
  fixedWidth: true,
});

// Our masonry layout will use 3 columns with a 10px gutter between
const cellPositioner = createMasonryCellPositioner({
  cellMeasurerCache: cache,
  columnCount: 4,
  columnWidth,
  spacer: 27,
});

const Images = (props) => {
  const [detailImages, setDetailImages] = useState();

  function cellRenderer({ index, key, parent, style }) {
    const datum = detailImages[index];

    const height = columnWidth || defaultHeight;

    return (
      <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
        <div style={style}>
          <img
            src={datum}
            style={{
              height: height,
              width: columnWidth,
              display: "block",
            }}
            alt="info"
          />
        </div>
      </CellMeasurer>
    );
  }

  useEffect(() => {
    const init = () => {
      const lastImages = Object.keys(props.record.params)
        .reverse()
        .find((e) => e.includes("images"));
      const images = [];
      for (var i = 0; i <= parseInt(lastImages.split(".")[1]); i++) {
        images.push(props.record.params[`images.${i}`]);
      }
      setDetailImages(images);
    };
    init();
  }, [props.record.params]);

  return (
    <>
      {detailImages ? (
        <div id="container">
          <div id="viewport">
            <Masonry
              cellCount={detailImages.length}
              cellMeasurerCache={cache}
              cellPositioner={cellPositioner}
              cellRenderer={cellRenderer}
              height={280}
              width={1320}
            />
          </div>
        </div>
      ) : (
        <p>loading...</p>
      )}
    </>
  );
};

export default Images;
