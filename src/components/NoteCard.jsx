import React, { useRef, useEffect, useState, useContext } from 'react';
import DeleteButton from './DeleteButton';
import Spinner from '../icons/Spinner';
import { setNewOffset, autoGrow, setZIndex, bodyParser } from '../utils';
import { db } from '../appwrite/databases';
import { NoteContext } from '../context/NoteContext';

const NoteCard = ({ note }) => {
  const [saving, setSaving] = useState(false);
  const [position, setPosition] = useState(JSON.parse(note.position));
  const colors = JSON.parse(note.colors);
  const body = bodyParser(note.body);

  const textAreaRef = useRef(null);
  const cardRef = useRef(null);
  const keyUpTimer = useRef(null);

  const { setSelectedNote } = useContext(NoteContext);

  let mouseStartPos = { x: 0, y: 0 };

  const mouseDown = (e) => {
    if (e.target.className === 'card-header') {
      setZIndex(cardRef.current);
      setSelectedNote(note);
      mouseStartPos = { x: e.clientX, y: e.clientY };
      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
    }
  } 

  const mouseUp = () => {
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);

    const newPosition = setNewOffset(cardRef.current);
    saveData('position', newPosition);
  }

  const mouseMove = (e) => {
    const mouseMoveDir = { x: mouseStartPos.x - e.clientX, y: mouseStartPos.y - e.clientY }; 

    mouseStartPos.x = e.clientX;
    mouseStartPos.y = e.clientY;

    const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
    setPosition(newPosition);
  }

  useEffect(() => {
    autoGrow(textAreaRef);
    setZIndex(cardRef.current);
  }, []);

  const saveData = async (key, value) => {
    const payload = {
      [key]: JSON.stringify(value)
    }

    try {
      await db.notes.update(note.$id, payload);
    } catch (error) {
      console.log(error);
    }
    setSaving(false);
  }

  const handleKeyUp = () => {
    setSaving(true);
    if (keyUpTimer.current) clearTimeout(keyUpTimer.current);
    keyUpTimer.current = setTimeout(() => {
      saveData('body', textAreaRef.current.value);
    }, 1000);
  }

  return (
    <div className="card"
      ref={cardRef}
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
        position: 'absolute' // Ensure positioning works
      }}>
      <div className="card-header"
        onMouseDown={mouseDown}
        style={{ backgroundColor: colors.colorHeader }}>
        <DeleteButton noteId={note.$id} />
        {
          saving && (
            <div className="card-saving">
              <Spinner color={colors.colorText} />
              <span style={{ color: colors.colorText }}>Saving...</span>
            </div>
          )
        }
      </div>

      <div className="card-body">
        <textarea
          ref={textAreaRef}
          onInput={() => {
            autoGrow(textAreaRef);
          }}
          onFocus={() => {
            setZIndex(cardRef.current);
            setSelectedNote(note);
          }}
          onKeyUp={handleKeyUp}
          style={{ color: colors.colorText }}
          defaultValue={body}
        ></textarea>
      </div>
    </div>
  )
}

export default NoteCard