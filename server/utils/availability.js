/**
 * Replaces an admin's unbooked schedule while always retaining booked slots.
 * A booked slot is business data and must never be reset by a schedule edit.
 */
export function mergeAvailabilitySlots(existingSlots = [], requestedTimes = []) {
  const bookedSlots = existingSlots.filter((slot) => slot.isBooked);
  const bookedTimes = new Set(bookedSlots.map((slot) => slot.time));
  const requestedSlots = [...new Set(requestedTimes)]
    .filter((time) => !bookedTimes.has(time))
    .map((time) => ({ time, isBooked: false }));

  return [...bookedSlots, ...requestedSlots].sort((a, b) =>
    a.time.localeCompare(b.time)
  );
}
