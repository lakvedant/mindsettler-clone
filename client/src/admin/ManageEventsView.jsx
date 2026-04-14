import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Loader2, Plus, Save, Trash2 } from "lucide-react";
import API from "../api/axios";

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });

const initialForm = {
  title: "",
  description: "",
  eventDate: "",
  durationMinutes: 90,
  location: "Online",
  mode: "online",
  therapistName: "",
  category: "workshop",
  highlights: "",
  registrationLink: "",
  imageUrl: "",
  status: "published",
};

const ManageEventsView = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [eventImageName, setEventImageName] = useState("");

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events/admin/all");
      setEvents(res.data.data || []);
    } catch (e) {
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setEventImageName("");
  };

  const parsedHighlights = useMemo(
    () =>
      formData.highlights
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [formData.highlights]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const payload = {
      ...formData,
      highlights: parsedHighlights,
    };

    try {
      if (editingId) {
        await API.patch(`/events/admin/update/${editingId}`, payload);
        setSuccess("Event updated successfully.");
      } else {
        await API.post("/events/admin/create", payload);
        setSuccess("Event created successfully.");
      }
      resetForm();
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save event.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event._id);
    setFormData({
      ...event,
      eventDate: event.eventDate ? new Date(event.eventDate).toISOString().slice(0, 16) : "",
      highlights: (event.highlights || []).join(", "),
    });
    setEventImageName("");
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
      setEventImageName(file.name);
    } catch (err) {
      setError("Failed to read selected image.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await API.delete(`/events/admin/delete/${id}`);
      fetchEvents();
    } catch (e) {
      setError("Could not delete event.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <CalendarDays className="text-[#Dd1764]" />
          <h2 className="text-xl font-black text-[#3F2965]">
            {editingId ? "Edit Event" : "Create Event"}
          </h2>
        </div>

        {error && <p className="text-sm text-red-600 font-semibold mb-3">{error}</p>}
        {success && <p className="text-sm text-green-600 font-semibold mb-3">{success}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Event title"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200"
          />
          <input
            type="datetime-local"
            value={formData.eventDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, eventDate: e.target.value }))}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200"
          />
          <input
            placeholder="Therapist name"
            value={formData.therapistName}
            onChange={(e) => setFormData((prev) => ({ ...prev, therapistName: e.target.value }))}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200"
          />
          <input
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200"
          />
          <select
            value={formData.mode}
            onChange={(e) => setFormData((prev) => ({ ...prev, mode: e.target.value }))}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
          <select
            value={formData.category}
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200"
          >
            <option value="workshop">Workshop</option>
            <option value="group-therapy">Group Therapy</option>
            <option value="webinar">Webinar</option>
            <option value="awareness-drive">Awareness Drive</option>
            <option value="retreat">Retreat</option>
          </select>
          <input
            type="number"
            min={30}
            placeholder="Duration in minutes"
            value={formData.durationMinutes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, durationMinutes: Number(e.target.value) }))
            }
            className="p-3 rounded-xl bg-slate-50 border border-slate-200"
          />
          <select
            value={formData.status}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input
            placeholder="Registration link"
            value={formData.registrationLink}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, registrationLink: e.target.value }))
            }
            className="p-3 rounded-xl bg-slate-50 border border-slate-200 md:col-span-2"
          />
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 md:col-span-2 space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase">Event Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm" />
            {eventImageName && (
              <p className="text-xs text-slate-500 font-semibold truncate">{eventImageName}</p>
            )}
          </div>
          <input
            placeholder="Highlights (comma separated)"
            value={formData.highlights}
            onChange={(e) => setFormData((prev) => ({ ...prev, highlights: e.target.value }))}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200 md:col-span-2"
          />
          <textarea
            placeholder="Event description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200 md:col-span-2"
          />

          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-3 rounded-xl bg-[#3F2965] text-white font-black text-xs uppercase flex items-center gap-2"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {editingId ? "Update Event" : "Add Event"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-3 rounded-xl border border-slate-200 text-slate-500 font-black text-xs uppercase"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-3xl border p-6 shadow-sm">
        <h3 className="text-lg font-black text-[#3F2965] mb-4">All Events</h3>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-[#3F2965]" />
          </div>
        ) : events.length === 0 ? (
          <p className="text-slate-500 font-medium">No events added yet.</p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event._id} className="p-4 rounded-2xl border bg-slate-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-black text-[#3F2965]">{event.title}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(event.eventDate).toLocaleString()} | {event.mode} | {event.status}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="px-3 py-2 rounded-lg text-xs font-black uppercase bg-white border"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="px-3 py-2 rounded-lg text-xs font-black uppercase text-red-600 bg-red-50 border border-red-100 flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEventsView;
