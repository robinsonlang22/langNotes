import React from 'react'
import Plus from '../icons/Plus'
import { useRef, useContext } from 'react'
import colors from '../assets/colors.json'
import { db } from '../appwrite/databases';
import { NoteContext } from '../context/NoteContext';

const AddButton = () => {

    const { setNotes } = useContext(NoteContext)
    const startingPosition = useRef(10)

    const addNote = async () => {
        const playload = {
            position: JSON.stringify({
                x: startingPosition.current,
                y: startingPosition.current
            }),
            colors: JSON.stringify(colors[0])
        }

        startingPosition.current += 10 
        const response = await db.notes.create(playload)
        setNotes(prev => [...prev, response])
    }

  return (
    <div id="add-button" onClick={addNote} >
      <Plus />
    </div>
  )
}

export default AddButton
