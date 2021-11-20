import React from "react";
import ArchiveOutlineIcon from "@mui/icons-material/DeleteOutline";
import Button from "@mui/material/Button";
import { format } from "date-fns";

function Note({ data, ...props }) {
  const { onDelete, onClick } = props;

  const { title, content, id, createdAt, updatedAt, isUpdated } = data;

  const getFormattedDate = (date) => {
    return format(date, "MMM Mo HH:mm a");
  };

  function handleClick() {
    onClick(data);
  }

  function handleDelete(e) {
    onDelete(id, "archive");
    e.stopPropagation();
  }
  return (
    <div className="note" onClick={handleClick}>
      <h1>{title}</h1>
      <p>{content}</p>
      <div className="noteFooter">
        <div>
          <p className="dateStyling">
            <b>C:</b> {getFormattedDate(createdAt)}
          </p>
          {isUpdated && (
            <p className="dateStyling">
              <b>U:</b> {getFormattedDate(updatedAt)}
            </p>
          )}
        </div>
        <Button onClick={handleDelete}>
          <ArchiveOutlineIcon />
        </Button>
      </div>
    </div>
  );
}

export default Note;
