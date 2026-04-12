'use client'

import  React, { useState } from 'react'



const BookEvent = () => {
    const [email,setEmail] = useState('')
    const [submitted , setSubmitted] = useState(false)

    
    const handleSubmit = (e:React.InputEvent) =>{
    e.preventDefault();
    setTimeout(() => {
        setSubmitted(true)    
    }, 1000);
}

    return (
    <div id='book-event'>
        {submitted ? (
            <p className='text-sm'>Thank you for signing up!</p>
        ):(
            <form action="">
                <div>
                    <label htmlFor="email" className='text-sm'>Email Adress</label>
                    <input 
                        type="email" 
                        name="email " id="email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        placeholder='Enter Your Email Adress'
                    />
                </div>
                <button onClick={handleSubmit}>
                    Submit
                </button>
            </form>
        )}
    </div>
  )
}

export default BookEvent
