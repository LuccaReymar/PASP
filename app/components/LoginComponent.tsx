'use client';
import { useRouter } from 'next/navigation';
import React from 'react'

const LoginComponent = () => {
  const router = useRouter();
  
  const submitLogin = () => {
    router.push("/dashboard")
    return
  }

  return (
    <div className="p-4 flex flex-row justify-center items-center">
      <div className="w-fit h-fit p-6 rounded-xl border flex flex-col items-center">
        <h1 className="text-xl font-bold">Login</h1>
        <form className="flex flex-col">
          <label>Email</label>
          <input
            type="text"
            placeholder="Email"
            className="border rounded px-2 mb-5"
          />
          <label>Password</label>
          <input
            type="password"
            placeholder=""
            className="border rounded px-2"
          />
          <button 
            type="submit" 
            onClick={() => submitLogin()}
            className='mt-4 rounded-xl border'
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginComponent
