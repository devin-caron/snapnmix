import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import "./CameraComp.css";
import { isMobile } from "react-device-detect";

const CameraComp = (props) => {
  const [images, setImages] = useState([]);

  // MOBILE
  // =======================================================================
  let updateInput = null;

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const convertImg = (fileList) => {
    let file = null;

    for (let i = 0; i < fileList.length; i++) {
      if (fileList[i].type.match(/^image\//)) {
        file = fileList[i];
        break;
      }
    }

    if (file !== null) {
      const newImages = [...images];
      newImages.push(URL.createObjectURL(file));
      setImages(newImages);
      toBase64(file).then((result) => onImageData(result));
    }
  };

  const getMobileImage = (img) => {
    const imgFiles = img.target.files;
    convertImg(imgFiles);
  };

  // DESKTOP
  // =======================================================================
  const videoConstraints = {
    width: { min: 460 },
    height: { min: 700 },
    facingMode: "environment",
    aspectRatio: 0.6666666667,
  };

  const webcamRef = React.useRef(null);

  const onImageData = (imgData) => {
    props.onImageData(imgData);
  };

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    onImageData(imageSrc);
  }, [webcamRef]);

  // =======================================================================

  useEffect(() => {
    if (isMobile) {
      updateInput.click();
    }
  }, []);

  return (
    <React.Fragment>
      <div className="camera_background">
        {!isMobile && (
          <div className="scan_camera_container">
            <Webcam
              height={720}
              width={480}
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
            <div className="scan_btn_container">
              <div className="scan_btn" onClick={capture}></div>
            </div>
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={getMobileImage}
        style={{ display: "none" }}
        ref={(ref) => (updateInput = ref)}
      />
    </React.Fragment>
  );
};

export default CameraComp;
