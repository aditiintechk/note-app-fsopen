import { useEffect, useState } from 'react'
import Note from './assets/components/Note.jsx'
import noteService from './services/notes.js'
import Notification from './assets/components/Notification.jsx'
import Footer from './assets/components/Footer.jsx'

const App = () => {
	const [notes, setNotes] = useState([])
	const [newNote, setNewNote] = useState('a new note...')
	const [showAll, setShowAll] = useState(true)
	const [errorMessage, setErrorMessage] = useState(
		'error messages will be displayed here'
	)

	useEffect(() => {
		noteService.getAll().then((initalNotes) => setNotes(initalNotes))
	}, [])

	const notesToShow = showAll
		? notes
		: notes.filter((note) => note.important === true)

	const toggleImportanceOf = (id) => {
		const note = notes.find((note) => note.id === id)
		const changedNote = { ...note, important: !note.important }

		noteService
			.update(id, changedNote)
			.then((returnedNote) => {
				setNotes(
					notes.map((note) => (note.id === id ? returnedNote : note))
				)
			})
			.catch(() => {
				setErrorMessage(`Note was alredy removed from the server`)
				setTimeout(() => {
					setErrorMessage(null)
				}, 5000)
				setNotes(notes.filter((note) => note.id !== id))
			})
	}

	function addNote(e) {
		e.preventDefault()
		const noteObject = {
			content: newNote,
			important: Math.random() < 0.5,
			id: String(notes.length + 1),
		}

		noteService.create(noteObject).then((returnedNote) => {
			setNotes(notes.concat(returnedNote))
			setNewNote('')
		})
	}

	return (
		<div>
			<h1>Notes</h1>
			<Notification message={errorMessage} />
			<ul>
				{notesToShow.map((note) => (
					<Note
						key={note.id}
						note={note}
						toggleImportance={() => toggleImportanceOf(note.id)}
					/>
				))}
			</ul>
			<form onSubmit={addNote}>
				<input
					type='text'
					value={newNote}
					onChange={(e) => setNewNote(e.target.value)}
				/>
				<button type='submit'>save</button>
			</form>
			<button onClick={() => setShowAll(!showAll)}>
				{showAll ? 'show important' : 'show all'}
			</button>
			<Footer />
		</div>
	)
}

export default App
