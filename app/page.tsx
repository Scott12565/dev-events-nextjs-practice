import Eventcard from "@/components/Eventcard"
import ExploreBtn from "@/components/ExploreBtn"
import { events } from "@/lib/constants"


function Home() {
  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev <br/> Event You Can't Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups, and Confrences, All in One Place</p>
      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Feature Events</h3>
        <ul className="events list-none">
          {events.map((event) => (
            <li key={event.title} >
              <Eventcard {...event} /> 
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Home
