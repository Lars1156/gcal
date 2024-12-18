import React, { useEffect, useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { gapi } from "gapi-script";

const CLIENT_ID = "http://138331386692-rndrvn47moolqmqonc3vgesimrtn0cnl.apps.googleusercontent.com";
const API_KEY = "AIzaSyBNxn09zcHPGG6AKoxiBUGq3fh8ApnxRFo";
const CALENDAR_ID = "primary"; // Use 'primary' for the primary calendar
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

const GoogleCalendar = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    function initializeGapi() {
      gapi.load("client:auth2", () => {
        gapi.client
          .init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
            ],
            scope: SCOPES,
          })
          .then(() => {
            const authInstance = gapi.auth2.getAuthInstance();
            setIsAuthorized(authInstance.isSignedIn.get());
            authInstance.isSignedIn.listen(setIsAuthorized);
          })
          .catch((error) => console.error("Error initializing GAPI", error));
      });
    }

    initializeGapi();
  }, []);

  const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOutClick = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const getEvent = () => {
    gapi.client.calendar.events
      .get({
        calendarId: CALENDAR_ID,
        eventId: "EVENT_ID_HERE", // Replace with the actual Event ID
      })
      .then((response) => {
        setEvent(response.result);
      })
      .catch((error) => console.error("Error fetching event", error));
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Google Calendar API with React and MUI
      </Typography>
      {!isAuthorized ? (
        <Button variant="contained" color="primary" onClick={handleAuthClick}>
          Sign in with Google
        </Button>
      ) : (
        <>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSignOutClick}
          >
            Sign Out
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={getEvent}
            style={{ marginLeft: "10px" }}
          >
            Get Event
          </Button>
        </>
      )}
      {event && (
        <div style={{ marginTop: "20px" }}>
          <Typography variant="h6">Event Details</Typography>
          <TextField
            label="Event Summary"
            value={event.summary || "No Summary"}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default GoogleCalendar;
