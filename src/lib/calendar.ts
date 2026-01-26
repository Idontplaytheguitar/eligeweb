import { google, calendar_v3 } from "googleapis";

function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret) {
    console.warn("Google Calendar credentials not configured");
    return null;
  }

  if (!refreshToken) {
    console.warn("Google Calendar REFRESH_TOKEN not configured");
    return null;
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return oauth2Client;
}

export interface CreateEventParams {
  summary: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  attendeeEmail: string;
  attendeeName: string;
  createMeetLink?: boolean;
}

export interface CreateEventResult {
  success: boolean;
  meetLink?: string;
  eventId?: string;
  error?: string;
}

export async function createCalendarEvent(
  params: CreateEventParams
): Promise<CreateEventResult> {
  const {
    summary,
    description,
    startDateTime,
    endDateTime,
    attendeeEmail,
    attendeeName,
    createMeetLink = true,
  } = params;

  try {
    const auth = getOAuth2Client();

    if (!auth) {
      return { success: false, error: "Google Calendar not configured" };
    }

    const calendar = google.calendar({ version: "v3", auth });

    const event: calendar_v3.Schema$Event = {
      summary,
      description,
      start: {
        dateTime: startDateTime,
        timeZone: "America/Argentina/Buenos_Aires",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "America/Argentina/Buenos_Aires",
      },
      attendees: [{ email: attendeeEmail, displayName: attendeeName }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 60 },
          { method: "popup", minutes: 30 },
        ],
      },
    };

    if (createMeetLink) {
      event.conferenceData = {
        createRequest: {
          requestId: `elige-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      };
    }

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      conferenceDataVersion: createMeetLink ? 1 : 0,
      sendUpdates: "all",
    });

    const meetLink = response.data.conferenceData?.entryPoints?.find(
      (ep) => ep.entryPointType === "video"
    )?.uri;

    return {
      success: true,
      meetLink: meetLink || undefined,
      eventId: response.data.id || undefined,
    };
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function cancelCalendarEvent(eventId: string): Promise<boolean> {
  try {
    const auth = getOAuth2Client();

    if (!auth) {
      return false;
    }

    const calendar = google.calendar({ version: "v3", auth });

    await calendar.events.delete({
      calendarId: "primary",
      eventId,
      sendUpdates: "all",
    });

    return true;
  } catch (error) {
    console.error("Error canceling calendar event:", error);
    return false;
  }
}

export function isGoogleCalendarConfigured(): boolean {
  return !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN
  );
}
