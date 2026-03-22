'use client'
import { useState } from "react"

function BookEvent() {

    const [email, setEmail] = useState('');
    const [submited, setSubmited] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setTimeout(() => {
            setSubmited(true);
        }, 1000)
    }
  return (
    <div id='book-event'>
      {submited ? (
        <p className="text-sm"> Thank you for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">Email Address</label>
                <input type="email" value={email}
                placeholder="eg joehndoea@doe.com" 
                onChange={(e) => setEmail(e.target.value)} id='email' />
            </div>

            <button type="submit" className="button-submit">Submit</button>
        </form>
      )}
    </div>
  )
}

export default BookEvent
