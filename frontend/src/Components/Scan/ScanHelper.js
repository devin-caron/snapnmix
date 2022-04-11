import React from "react";
import "./ScanHelper.css";
import { Modal } from "react-bootstrap";

const ScanHelper = (props) => {
  return (
    <Modal {...props} centered>
      <Modal.Header closeButton>
        <div className="scan_helper_header">Scanning Tips</div>
      </Modal.Header>
      <Modal.Body>
        <div className="scan_helper_card">
          <div className="scan_helper_card_row_drinks">
            <div className="scan_display_drink_primary">
              <ion-icon name="wine-outline"></ion-icon>
            </div>
            <div className="scan_display_drink_secondary">
              <ion-icon name="wine-outline"></ion-icon>
            </div>
            <div className="scan_display_drink_tertiary">
              <ion-icon name="wine-outline"></ion-icon>
            </div>
            <div className="scan_display_drink_secondary">
              <ion-icon name="wine-outline"></ion-icon>
            </div>
            <div className="scan_display_drink_primary">
              <ion-icon name="wine-outline"></ion-icon>
            </div>
          </div>
          <div className="scan_helper_card_row_btn">
            <ion-icon name="radio-button-on-outline"></ion-icon>
          </div>
        </div>
        <ul className="scan_helper_list">
          <li>Camera should have a clear view of the ingredients</li>
          <li>Room should be well lit</li>
          <li>Text to identify ingredients should be clear</li>
          <li>Try to keep the camera steady when taking the picture</li>
        </ul>
      </Modal.Body>
    </Modal>
  );
};

export default ScanHelper;
