import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add.js";
import AlarmIcon from "@mui/icons-material/Alarm";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import ReminderPicker from "./ReminderPicker";
import { Button } from "@mui/material";

function CreateArea({ onAdd }) {
  const [isExpanded, setExpanded] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [note, setNote] = useState({
    title: "",
    content: "",
    reminder: null,
    isReminderShow: false,
  });

  /**
   * Handle the change of the input, so whatever you write in the input is saved on the state, so
   * the component keeps track of the value as you write it.
   * @param {event} e is the event that triggered the function call, in this case change to the input
   */
  function handleChange(e) {
    const { name, value } = e.target;
    setNote((preValue) => {
      return {
        ...preValue,
        [name]: value,
      };
    });
  }

  function handleExpanded() {
    setExpanded(true);
  }

  const submitButton = async (e) => {
    onAdd(note);

    setNote({
      title: "",
      content: "",
    });
    e.preventDefault();
  };
  return (
    <div>
      <form
        style={{ display: "flex", flexDirection: "column", minHeight: "10rem" }}
      >
        {isExpanded && (
          <input
            type="text"
            value={note.title}
            onChange={handleChange}
            placeholder="Title"
            name="title"
            maxLength="50"
          />
        )}
        <p>
          <TextareaAutosize
            value={note.content}
            onClick={handleExpanded}
            onChange={handleChange}
            rows={isExpanded ? 3 : 1}
            name="content"
            placeholder="Start writing..."
            aria-label="minimum height"
            minRows={3}
          ></TextareaAutosize>
        </p>

        <div>
          <Button
            onClick={() => {
              setShowReminder(!showReminder);
              if (!showReminder) {
                setNote((preValue) => {
                  return {
                    ...preValue,
                    reminder: null,
                  };
                });
              }
            }}
          >
            <AlarmIcon />
          </Button>
          {showReminder && (
            <ReminderPicker
              onChange={(dateTime) =>
                setNote((preValue) => {
                  return {
                    ...preValue,
                    reminder: dateTime,
                  };
                })
              }
            />
          )}
        </div>

        <Button
          variant="contained"
          onClick={submitButton}
          style={{ marginTop: "10px" }}
        >
          <AddIcon />
        </Button>
      </form>
    </div>
  );
}

export default CreateArea;
