import NotesPage from "./pages/NotesPage"
import { NoteProvider } from "./context/NoteContext"

function App(){
    return(
    <div id="myApp">
        <NoteProvider>
            <NotesPage />
        </NoteProvider>
    </div>
    )
}

export default App