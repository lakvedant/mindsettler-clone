import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, MapPin, Sparkles, UserRound } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import API from "../api/axios";

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {event.imageUrl ? (
        <img src={event.imageUrl} alt={event.title} className="h-48 w-full object-cover" />
      ) : (
        <div className="h-48 bg-gradient-to-br from-[#3F2965] via-[#5f3f95] to-[#Dd1764] flex items-center justify-center text-white">
          <Sparkles size={38} />
        </div>
      )}

      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="px-2.5 py-1 rounded-full bg-pink-50 text-[#Dd1764] text-[10px] uppercase font-black tracking-wider">
            {event.category?.replace("-", " ")}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] uppercase font-black tracking-wider">
            {event.mode}
          </span>
        </div>

        <h3 className="text-xl font-black text-[#3F2965]">{event.title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{event.description}</p>

        <div className="space-y-1.5 text-xs text-slate-500 font-semibold">
          <p className="flex items-center gap-1.5">
            <CalendarDays size={14} /> {new Date(event.eventDate).toLocaleString()}
          </p>
          <p className="flex items-center gap-1.5">
            <Clock3 size={14} /> {event.durationMinutes || 90} minutes
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin size={14} /> {event.location || "Online"}
          </p>
          <p className="flex items-center gap-1.5">
            <UserRound size={14} /> Led by {event.therapistName}
          </p>
        </div>

        {Array.isArray(event.highlights) && event.highlights.length > 0 && (
          <div className="pt-2">
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">
              Key Highlights
            </p>
            <ul className="space-y-1">
              {event.highlights.slice(0, 3).map((item, idx) => (
                <li key={idx} className="text-xs text-slate-600">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {event.registrationLink && (
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex mt-2 px-4 py-2 rounded-xl bg-[#3F2965] text-white text-xs font-black uppercase tracking-wide"
          >
            Register
          </a>
        )}
      </div>
    </div>
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/events")
      .then((res) => setEvents(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming = [];
    const past = [];
    events.forEach((event) => {
      if (new Date(event.eventDate).getTime() >= now.getTime()) upcoming.push(event);
      else past.push(event);
    });
    return {
      upcomingEvents: upcoming.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)),
      pastEvents: past.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate)),
    };
  }, [events]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 pt-28">
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="text-center mb-10">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#Dd1764] mb-3">
              Therapist-led community programs
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-[#3F2965]">Psychological Events</h1>
            <p className="text-slate-500 mt-3 max-w-3xl mx-auto">
              Join workshops, awareness drives, and group therapy experiences organized by
              MindSettler therapists to support emotional resilience, clarity, and healing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="bg-white rounded-3xl p-6 border shadow-sm">
              <h2 className="text-xl font-black text-[#3F2965] mb-2">What events we do</h2>
              <p className="text-sm text-slate-600">
                We organize workshops, group therapy circles, guided reflection sessions, stress
                management webinars, and emotional wellness events for students, working
                professionals, and organizations.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-6 border shadow-sm">
              <h2 className="text-xl font-black text-[#3F2965] mb-2">How we clear & heal</h2>
              <p className="text-sm text-slate-600">
                Every event combines therapist guidance, practical tools, and structured exercises
                that help participants process emotions, build coping methods, and leave with a
                clearer, actionable mental health plan.
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-center py-16 text-slate-500 font-semibold">Loading events...</p>
          ) : (
            <>
              <section className="mb-14">
                <h2 className="text-2xl font-black text-[#3F2965] mb-5">Upcoming Events</h2>
                {upcomingEvents.length === 0 ? (
                  <p className="text-slate-500 font-medium">No upcoming events right now.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {upcomingEvents.map((event) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h2 className="text-2xl font-black text-[#3F2965] mb-5">Past Events</h2>
                {pastEvents.length === 0 ? (
                  <p className="text-slate-500 font-medium">Past events will appear here.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {pastEvents.map((event) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
};

export default EventsPage;
