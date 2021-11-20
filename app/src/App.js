import React, { useState, useEffect } from "react";

import "./App.css";
import Header from "./components/Header.js";
import Count from "./components/Count";
import CreateArea from "./components/CreateArea";
import Note from "./components/Note";
import DeletedNote from "./components/DeletedNote";
import Footer from "./components/Footer";
import AlertDialog from "./components/AlertDialog";
import EditModal from "./components/EditModal";
import localforage from "localforage";
import { Button } from "@mui/material";
import NotifyModal from "./components/NotifyModal";
import { blue, green, grey } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ColorModeContext from "./context/ColorModeContext";

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for dark mode

          primary: green,
          divider: blue[700],
          background: {
            default: grey[900],
            paper: grey[900],
          },
          text: {
            primary: grey[400],
            secondary: grey[400],
          },
        }
      : {
          // palette values for light mode

          primary: blue,
          divider: blue,
          background: {
            default: grey[900],
            paper: grey[50],
          },
          text: {
            primary: grey[900],
            secondary: grey[800],
          },
        }),
  },
});

function App() {
  const [mode, setMode] = React.useState("light");
  const colorMode = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  // Update the theme only if the mode changes
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const [notes, setNotes] = useState([]);
  const [noteToDeleteId, setNoteToDeleteId] = useState(null);
  const [currentNote, setCurrentNote] = useState(null);
  const [activeReminders, setActiveReminders] = useState([]);
  const [activeReminder, setActiveReminder] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [shouldOpenDialog, setDeleteWarning] = useState(false);
  const [showArchiveScreen, setShowArchiveScreen] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [archivedNotes, setArchivedNotes] = useState([]);

  useEffect(async () => {
    try {
      const _notes = (await localforage.getItem("notes")) ?? [];
      setNotes(_notes);
      const _archivedNotes = (await localforage.getItem("archivedNotes")) ?? [];
      setArchivedNotes(_archivedNotes);
    } catch (err) {
      console.log("err", err);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleReminder(activeReminders);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeReminders]);

  useEffect(() => {
    const notesWithReminder = getNotesWithReminder(notes);
    setActiveReminders(notesWithReminder);
  }, [notes]);

  function getNotesWithReminder(notes) {
    return notes.filter((note) => note.reminder && !note.isReminderShow);
  }

  function handleReminder(reminders) {
    const activeRem = reminders.find((rem) => {
      const now = Date.now();
      const getRemTime = new Date(rem.reminder).getTime();
      return getRemTime <= now;
    });

    setActiveReminder(activeRem);
    setShowNotifyModal(true);
  }

  async function addNote(newNote) {
    const newId = notes.length > 0 ? notes[notes.length - 1].id + 1 : 1;

    newNote.id = newId;
    newNote.isUpdated = false;
    newNote.createdAt = new Date();
    newNote.updatedAt = new Date();

    setNotes((preValue) => {
      return [...preValue, newNote];
    });

    try {
      const _notes = (await localforage.getItem("notes")) ?? [];
      _notes.push(newNote);

      await localforage.setItem("notes", _notes);
    } catch (err) {
      console.log("err", err);
    }
  }

  async function onDeleteNote(id, type) {
    setDeleteWarning(true);
    setNoteToDeleteId(id);
    setActionType(type);
  }

  async function handleNoteAction(id, actionType) {
    setNotes((preValue) => {
      return [...preValue.filter((note) => note.id !== id)];
    });
    setNoteToDeleteId(null);
    closeDeleteWarning();

    try {
      const notes = await localforage.getItem("notes");
      const newNotes = notes.filter((note) => note.id !== id);
      const archivedNote = notes.filter((note) => note.id == id)[0];
      await localforage.setItem("notes", newNotes);

      let archivedNotes = (await localforage.getItem("archivedNotes")) || [];
      if (actionType === "delete") {
        archivedNotes = archivedNotes.filter((note) => note.id !== id);
      } else {
        archivedNotes.push(archivedNote);
      }
      await localforage.setItem("archivedNotes", archivedNotes);
      setArchivedNotes(archivedNotes);
      setNotes(newNotes);
    } catch (err) {
      console.log("err", err);
    }
  }

  async function updateNote(note) {
    // Copy the initial notes and add up the edited note to it
    const newNotes = [...notes].map((el) => (el.id !== note.id ? el : note));
    // Update the notes with the newly copied
    setNotes(newNotes);
    setShowNoteModal(false);
    await localforage.setItem("notes", newNotes);
  }

  function closeDeleteWarning() {
    setDeleteWarning(false);
  }

  function onNoteClicked(note) {
    setShowNoteModal(true);
    setCurrentNote(note);
  }
  const onRevertBtn = async (id) => {
    try {
      let _archivedNotes = (await localforage.getItem("archivedNotes")) ?? [];
      const archivedNoteItem = _archivedNotes.filter(
        (note) => note.id == id
      )[0];

      const newArchivedNotes = _archivedNotes.filter((note) => note.id !== id);
      await localforage.setItem("archivedNotes", newArchivedNotes);
      const _notes = (await localforage.getItem("notes")) || [];
      _notes.push(archivedNoteItem);
      await localforage.setItem("notes", _notes);
      setNotes(_notes);
      setArchivedNotes(newArchivedNotes);
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleArchiveScreen = () => {
    setShowArchiveScreen(!showArchiveScreen);
  };

  const headerRightView = () => {
    if (!showArchiveScreen) {
      return (
        <Button
          variant="outlined"
          color="warning"
          onClick={handleArchiveScreen}
        >
          Archived Notes
        </Button>
      );
    }

    return (
      <Button variant="outlined" color="success" onClick={handleArchiveScreen}>
        Active Notes
      </Button>
    );
  };

  const handleReminderClose = (note) => {
    setShowNotifyModal(false);
    note.isReminderShow = true;
    updateNote(note);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Header
            renderRightView={headerRightView}
            centerClick={colorMode.toggleColorMode}
          />

          {!showArchiveScreen ? (
            <>
              <Count
                count={
                  notes.length === 0
                    ? "Go ahead, write your first note!"
                    : `Hurray! You wrote ${notes.length} notes!`
                }
              />
              <CreateArea onAdd={addNote} />
              {notes?.map((note, index) => (
                <Note
                  key={index}
                  data={note}
                  onClick={onNoteClicked}
                  onDelete={onDeleteNote}
                />
              ))}
            </>
          ) : (
            <ArchiveScreen />
          )}

          {shouldOpenDialog && (
            <AlertDialog
              title={`${actionType?.toUpperCase()} NOTE`}
              content={`Are you sure you want to ${actionType} this note?`}
              confirmText="Yes"
              shouldOpen={shouldOpenDialog}
              onConfirm={() => handleNoteAction(noteToDeleteId, actionType)}
              onCancel={closeDeleteWarning}
            />
          )}
          {showNoteModal && (
            <EditModal
              showModal={showNoteModal}
              onCloseModal={() => setShowNoteModal(false)}
              data={currentNote}
              onSubmit={updateNote}
            />
          )}

          {activeReminder && (
            <NotifyModal
              show={showNotifyModal}
              noteTitle={`Title: ${activeReminder?.title} `}
              noteContent={`Content:  ${activeReminder?.content}`}
              onClose={() => handleReminderClose(activeReminder)}
            />
          )}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );

  function ArchiveScreen() {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 30,
        }}
      >
        <h2>Archived items</h2>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            margin: "20px",
          }}
        >
          {archivedNotes &&
            archivedNotes.map((note, index) => (
              <DeletedNote
                key={index}
                data={note}
                onClick={onNoteClicked}
                onDelete={onDeleteNote}
                onRevert={onRevertBtn}
              />
            ))}
        </div>
      </div>
    );
  }
}

export default App;
