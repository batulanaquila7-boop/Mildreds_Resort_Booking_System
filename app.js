const BOOKING_KEY = 'mildredsBookings';

function getBookings() {
    return JSON.parse(
        localStorage.getItem(BOOKING_KEY) || '[]'
    );
}

function saveBookings(data) {
    localStorage.setItem(
        BOOKING_KEY,
        JSON.stringify(data)
    );
}

function selectRoom(room) {
    document.getElementById('room').value = room;

    document
        .getElementById('booking')
        .scrollIntoView({
            behavior: 'smooth'
        });
}

function showCustomerBooking() {
    const box = document.getElementById('customerBooking');

    if (!box) {
        return;
    }

    const bookings = getBookings();
    const booking = bookings[bookings.length - 1];

    if (!booking) {
        box.className = 'customer-booking empty-booking';

        box.innerHTML = `
            <div class="empty-icon">📅</div>
            <h3>No Booking Yet</h3>
            <p>
                Your reservation will appear here after you
                submit the booking form.
            </p>
            <a href="#booking" class="btn">
                Make a Booking
            </a>
        `;

        return;
    }

    box.className = 'customer-booking booking-display';

    box.innerHTML = `
        <div class="booking-top">
            <div>
                <small>BOOKING ID</small>
                <strong>${booking.id}</strong>
            </div>

            <span class="status ${booking.status.toLowerCase()}">
                ${booking.status}
            </span>
        </div>

        <div class="booking-details">
            <p>
                <b>Guest:</b> ${booking.name}
            </p>

            <p>
                <b>Email:</b> ${booking.email}
            </p>

            <p>
                <b>Phone:</b> ${booking.phone}
            </p>

            <p>
                <b>Room:</b> ${booking.room}
            </p>

            <p>
                <b>Check-In:</b> ${booking.checkIn}
            </p>

            <p>
                <b>Check-Out:</b> ${booking.checkOut}
            </p>

            <p>
                <b>Guests:</b>
                ${booking.adults} adult(s),
                ${booking.children} child(ren)
            </p>

            <p>
                <b>Special Request:</b>
                ${booking.notes || 'None'}
            </p>
        </div>
    `;
}

const form = document.getElementById('bookingForm');

if (form) {
    const today = new Date()
        .toISOString()
        .split('T')[0];

    document.getElementById('checkIn').min = today;
    document.getElementById('checkOut').min = today;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const checkIn =
            document.getElementById('checkIn').value;

        const checkOut =
            document.getElementById('checkOut').value;

        const message =
            document.getElementById('message');

        if (new Date(checkOut) <= new Date(checkIn)) {
            message.textContent =
                'Check-Out date must be later than Check-In date.';

            message.className = 'message error';

            return;
        }

        const booking = {
            id: `MR-${Date.now().toString().slice(-6)}`,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            room: document.getElementById('room').value,
            checkIn,
            checkOut,
            adults: document.getElementById('adults').value,
            children: document.getElementById('children').value,
            notes: document.getElementById('notes').value,
            status: 'Pending'
        };

        saveBookings([
            ...getBookings(),
            booking
        ]);

        message.textContent =
            'Booking Submitted Successfully! Your reservation is now Pending.';

        message.className = 'message success';

        form.reset();

        document.getElementById('adults').value = 1;
        document.getElementById('children').value = 0;

        showCustomerBooking();

        setTimeout(() => {
            document
                .getElementById('dashboard')
                .scrollIntoView({
                    behavior: 'smooth'
                });
        }, 300);
    });
}

showCustomerBooking();