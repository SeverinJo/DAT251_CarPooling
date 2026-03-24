import { useEffect, useState } from "react"
import { currentUser, getBookings } from "../api/mock"
import Avatar from "@mui/material/Avatar"
import type { Booking } from "../types"

function ProfilePage() {
        const [bookings, setBookings] = useState<Booking[]>([])
        const [loading, setLoading] = useState(true)

        useEffect(() => {
          getBookings().then((data) => {
            setBookings(data)
            setLoading(false)
          })
        }, [])

        return (
          <div>
            <h1>{currentUser.name}</h1>
            <Avatar src={currentUser.avatar} sx={{ width: 400, height: 400 }} />
            <p>Rating: {currentUser.rating}</p>
            <p>{currentUser.email} </p>
            {loading ? <p>Loading...</p> : bookings.map(b => (
              <div key={b.id}>{/* booking card */}</div>
            ))}
          </div>
        )

}

export default ProfilePage;