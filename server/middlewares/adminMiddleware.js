import { json } from "express";

export const admin = (req, res, next) => {
    // BYPASS START
    return next();
    // BYPASS END
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};


/**
 * Middleware to validate availability creation/updates
 * Ensures YYYY-MM-DD format, 24h time format, and logical date constraints
 */
export const validateAvailability = (req, res, next) => {
    let { date, slots } = req.body;
    // 1. Basic Existence Check
    if (!date || !slots) {
        return res.status(400).json({ 
            message: "Missing required fields. Both 'date' and 'slots' are required." 
        });
    }
    try {
        slots = Array.isArray(slots) ? slots : JSON.parse(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

    // 2. Date Format Validation (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        return res.status(400).json({ 
            message: "Invalid date format. Please use YYYY-MM-DD." 
        });
    }

    // 3. Prevent Past Dates
    const inputDate = new Date(date);
    const today = new Date();
    
    // Set both to midnight for a fair date-only comparison
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (inputDate < today) {
        return res.status(400).json({ 
            message: "Cannot set availability for a past date." 
        });
    }

    // 4. Slots Array Validation
    if (!Array.isArray(slots)) {
        return res.status(400).json({ 
            message: "Slots must be provided as an array." 
        });
    }

    if (slots.length === 0) {
        return res.status(400).json({ 
            message: "Availability must contain at least one time slot." 
        });
    }

    // 5. Individual Time Format Validation (HH:mm 24-hour format)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const invalidSlots = slots.filter(slot => !timeRegex.test(slot));

    if (invalidSlots.length > 0) {
        return res.status(400).json({ 
            message: `Invalid time format in slots: ${invalidSlots.join(", ")}. Use HH:mm (24-hour).` 
        });
    }

    // 6. Prevent Past Times if Date is 'Today'
    const now = new Date();
    const isToday = inputDate.getTime() === today.getTime();

    if (isToday) {
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const pastSlots = slots.filter(slot => slot < currentTime);

        if (pastSlots.length > 0) {
            return res.status(400).json({ 
                message: `Cannot add slots that have already passed: ${pastSlots.join(", ")}` 
            });
        }
    }

    // All checks passed!
    next();
};