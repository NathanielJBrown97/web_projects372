// Initialize Google API Client
function start() {
    gapi.client.init({
        'apiKey': 'YOUR_API_KEY', // Optional
        'clientId': '433893821442-j1rpdi5v1hblv8ur6bsrulrkr6idfci5.apps.googleusercontent.com',
        'scope': 'https://www.googleapis.com/auth/calendar.events',
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
    }).then(function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

gapi.load('client:auth2', start);

// Change sign in Status if signed in or not.
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        // User is signed in.
        // You can now make API calls or enable booking features.
    } else {
        // User is not signed in. Prompt user to sign in.
        gapi.auth2.getAuthInstance().signIn();
    }
}

// On auth click event, sign them in
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

// On signout, signout.
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

// Converts the date time to RFC 3339 format - per demands of Google API
function convertToRFC3339(dateTimeStr) {
    // Create a Date object from the dateTimeStr
    const date = new Date(dateTimeStr);

    // Google Calendar API will interpret the time based on the timeZone specified in eventDetails
    return date.toISOString().replace('.000', ''); // Simple conversion, adjust as needed
}

// Actually create the calendar event.
function createCalendarEvent(eventDetails) {
    // Ensure the user is authenticated
    var request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': eventDetails
    });

    request.execute(function(event) {
        console.log('Event created: ' + event.htmlLink);
        alert('Event created successfully!');
    });
}

// List of objects with subject, date, time, and description of appointment.
const tutoringSessions = [
    // ACT Prep sessions
    { subject: "ACT", date: "2023-03-10", time: "10:00 AM - 12:00 PM", description: "ACT Math Focus" },
    // Additional session objects...
];

// Set dropdown menu by getting element ID
const subjectDropdown = document.getElementById("subjectDropdown");
// Set container for session displays by the sessionList element id
const sessionsList = document.getElementById("sessionsList");

subjectDropdown.addEventListener("change", function() {
    sessionsList.innerHTML = ""; // Clear previous content
    const selectedSubject = this.value;
    const filteredSessions = tutoringSessions.filter(session => session.subject === selectedSubject);

    // loop over the filtered sessions
    filteredSessions.forEach(session => {
        // create new div for each session
        const row = document.createElement("div");
        row.className = "session-row";
        row.innerHTML = `
            <div class="session-cell">${session.date}</div>
            <div class="session-cell">${session.time}</div>
            <div class="session-cell">${session.description}</div>
        `;
        const tutorDropdownCell = document.createElement("div");
        tutorDropdownCell.className = "session-cell";
        tutorDropdownCell.appendChild(createTutorDropdown());
        row.appendChild(tutorDropdownCell);

        const bookingLinkCell = document.createElement("div");
        bookingLinkCell.className = "session-cell";
        bookingLinkCell.appendChild(createBookingLink(session));
        row.appendChild(bookingLinkCell);

        sessionsList.appendChild(row);
    });
});

// Function to create a dropdown for tutor selection
function createTutorDropdown() {
    const select = document.createElement('select');
    select.innerHTML = `
        <option value="">Select Tutor</option>
        <option value="Tutor 1">Edward Lee</option>
        <option value="Tutor 2">Eli Epstien</option>
        <option value="Tutor 3">Some Thirdguy</option>`;
    return select;
}

// Function to create a booking link
function createBookingLink(session) {
    const link = document.createElement('a');
    link.href = "#";
    link.className = "book-session-btn";
    link.innerText = "Book Now";
    link.setAttribute('data-date', session.date);
    link.setAttribute('data-time', session.time);
    link.setAttribute('data-description', session.description);
    link.addEventListener('click', handleBooking);
    return link;
}

// Handle the booking on event.
function handleBooking(event) {
    event.preventDefault();
    const link = event.target;
    const sessionDate = link.getAttribute('data-date');
    const sessionTime = link.getAttribute('data-time').split(" - ");
    const sessionDescription = link.getAttribute('data-description');

    const startTime = `${sessionDate} ${sessionTime[0]}`;
    const endTime = `${sessionDate} ${sessionTime[1]}`;

    const eventDetails = {
        'summary': sessionDescription,
        'start': {
            'dateTime': convertToRFC3339(startTime),
            'timeZone': 'America/New_York'
        },
        'end': {
            'dateTime': convertToRFC3339(endTime),
            'timeZone': 'America/New_York'
        }
    };

    createCalendarEvent(eventDetails);
}
