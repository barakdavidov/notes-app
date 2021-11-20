import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog({
  shouldOpen,
  title,
  content,
  onConfirm,
  onCancel,
  confirmText,
}) {
  return (
    <div>
      <Dialog
        open={shouldOpen}
        onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>No</Button>
          <Button onClick={onConfirm} autoFocus>
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
