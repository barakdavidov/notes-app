import React from "react";
import UnarchiveOutlinedIcon from "@mui/icons-material/UnarchiveOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Button from "@mui/material/Button";
import { format } from "date-fns";

function DeletedNote({ data, ...props }) {
  const { onDelete, onRevert } = props;

  const { title, content, id, createdAt, updatedAt, isUpdated } = data;

  const getFormattedDate = (date) => {
    return format(date, "MMM Mo HH:mm a");
  };

  function handleDelete(e, id) {
    onDelete(id, "delete");
    e.stopPropagation();
  }
  return (
    <div className="note">
      <h1>{title}</h1>
      <p>{content}</p>
      <div className="noteFooter">
        <Button
          style={{
            margin: "-3px",
          }}
          onClick={() => onRevert(id)}
        >
          <UnarchiveOutlinedIcon />
        </Button>
        <Button onClick={(e) => handleDelete(e, id)}>
          <DeleteOutlineIcon />
        </Button>
        <p className="dateStyling">
          <b>Created:</b> {getFormattedDate(createdAt)}
        </p>
        {isUpdated && (
          <p className="dateStyling">
            <b>Updated:</b> {getFormattedDate(updatedAt)}
          </p>
        )}
      </div>
    </div>
  );
}

export default DeletedNote;
