import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#f44336",
  color: "white",
  border: "2px solid #red",
  boxShadow: 24,
  p: 4,
};

export default function NotifyModal({ noteTitle, noteContent, onClose, show }) {
  return (
    <div>
      <Modal
        open={show}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <h2 style={{ marginBottom: "10px" }}> Reminder Note</h2>
            <h4> {noteTitle} </h4>
            <h4> {noteContent} </h4>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
