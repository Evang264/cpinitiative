import * as React from "react"
import { useState } from "react"
import axios from "axios"

export default function EmailForm({ listName, tag, wide }: {
  listName: string;
  tag: string;
  wide?: boolean;
}) {
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<React.ReactNode>()

  return (<>
      <form onSubmit={e => {
        e.preventDefault()
        setSuccess(false)
        setError(null)
        if (submitting) return
        if (!email || email.indexOf("@") === -1) {
          setError(<>Please enter a valid email.</>)
          return
        }
        setSubmitting(true)
        axios.post(
          "/api/join-classes-mailing-list",
          {
            email,
            tags: tag
          }
        ).then(response => {
          setSubmitting(false)
          setSuccess(true)
        }).catch(error => {
          setSubmitting(false)
          console.log({ ...error })
          if (error.response && error.response.data.code) {
            if (error.response.data.code === "already_subscribed") {
              setError(<>It looks like this email address is already on our list.<br/> If you don't think you're getting our
                emails, please <a href={"mailto:usacoguide@gmail.com"}
                                  className={"text-red-600 hover:text-red-800 hover:underline"}>contact us</a>.</>)
              return
            }
          }
          setError(<>An unknown error occurred. Please try again later <br/>or <a href={"mailto:usacoguide@gmail.com"}
                                                                             className={"text-red-600 hover:text-red-800 hover:underline"}>contact
            us</a>.</>)
        })
      }} className="mt-3 sm:flex">
        <input value={email}
               onChange={(e) => setEmail(e.target.value)}
               aria-label="Email"
               disabled={submitting}
               className={wide ?
                 "appearance-none w-full px-5 py-3 border border-transparent text-base leading-6 rounded-md text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 transition duration-150 ease-in-out sm:w-screen sm:max-w-xs"
                 : "appearance-none block w-full px-3 py-3 border border-gray-300 text-base leading-6 rounded-md placeholder-gray-500 shadow-sm focus:outline-none focus:placeholder-gray-400 focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:flex-1"
               }
               placeholder="Enter your email"/>


        {wide ? <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
          <button disabled={submitting}
                  className={(submitting ? "bg-purple-300" : "bg-purple-500 hover:bg-purple-400 focus:outline-none focus:bg-purple-400") + " w-full flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white transition duration-150 ease-in-out"}>
            Notify me
          </button>
        </div> : <button
          type="submit"
          disabled={submitting}
          className={(submitting ? "bg-gray-500" : "bg-gray-800 hover:bg-gray-700 focus:outline-none focus:border-gray-900 focus:shadow-outline-gray active:bg-gray-900") + " mt-3 w-full px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white shadow-sm transition duration-150 ease-in-out sm:mt-0 sm:ml-3 sm:flex-shrink-0 sm:inline-flex sm:items-center sm:w-auto"}>
          {submitting ? "Joining Waitlist..." : " Join Waitlist"}
        </button>}

      </form>
      {wide ? <>
        {!error && !success && <p className="mt-3 text-sm leading-5 text-gray-300">
          No spam emails. You can unsubscribe at any time!
        </p>}
        {error
        && <p className="mt-3 text-sm leading-5 text-red-300">{error}</p>}
        {success
        &&
        <p className="mt-3 text-sm leading-5 text-green-300">You've been added to
          our {listName} mailing list!</p>}
      </> : <>
        {error
        && <p className={"mt-3 w-full py-1 text-base leading-6 font-medium rounded-md text-red-400"}>{error}</p>}
        {success
        &&
        <p className={"mt-3 w-full py-1 text-base leading-6 font-medium rounded-md text-green-400"}>You've been added to
          our {listName} mailing list!</p>}
      </>}

    </>
  )
}