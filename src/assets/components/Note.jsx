const Note = ({ note, toggleImportance }) => {
	const label = note.important ? 'mark not important' : 'mark important'
	return (
		<li>
			{note.content} <button onClick={toggleImportance}>{label}</button>
		</li>
	)
}

export default Note
