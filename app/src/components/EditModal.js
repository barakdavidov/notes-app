import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import { Typography } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function EditModal({ data, showModal, onCloseModal, onSubmit }) {
  const [values, setValues] = React.useState({
    id: data.id,
    title: data.title,
    content: data.content,
    createdAt: data.createdAt,
    isUpdated: true,
    updatedAt: new Date(),
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  function submitButton() {
    onSubmit(values);
  }
  return (
    <div>
      <Modal
        open={showModal}
        onClose={onCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="form" sx={style} autoComplete={false}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <b>Edit Note</b>
          </Typography>
          <br />
          <FormControl sx={{ m: 1, width: "50ch" }} variant="outlined">
            <TextField
              fullWidth
              label="Title"
              id="fullWidth"
              placeholder="Title"
              onChange={handleChange("title")}
              defaultValue={data.title}
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "50ch" }} variant="outlined">
            <TextField
              id="outlined-multiline-static"
              label="Content"
              multiline
              rows={3}
              placeholder="Content"
              onChange={handleChange("content")}
              defaultValue={data.content}
            />
          </FormControl>
          <FormControl sx={{ m: 1, size: "large" }} variant="outlined">
            <Button
              color="primary"
              onClick={submitButton}
              variant="contained"
              style={{ width: 80, height: 40 }}
            >
              Update
            </Button>
          </FormControl>
        </Box>
      </Modal>
    </div>
  );
}
