# RMWUG private facilitator control plane

This source belongs in an Apps Script project bound to the private facilitator spreadsheet. It is stored in GitHub for auditability, but it contains no student data or access codes.

The bound script adds an `RMWUG Control` menu to the Sheet and supplies the student assignment lookup service used by the public workshop app.

Security boundary:

- The private Google Sheet holds the roster, emails, full assignments, access codes, responses, and audit log.
- The public GitHub Pages site holds only method guidance, the topic bank, and the web-app deployment URL.
- A successful lookup returns one student's assignment and pod-member names. It never returns emails, the access code, or the full register.
- Only rows marked `LOCKED` are released.
- Eight failed attempts within ten minutes trigger a temporary cooldown for that Student ID.

Operational sequence:

1. Replace the placeholder roster in the Sheet.
2. Set pod membership and validate.
3. Generate missing access codes.
4. Run the seeded draft draw.
5. Inspect `Assignments` and `Pod Plan`.
6. Lock once and build `Access Cards`.
7. Give each student only their own card.
8. Rotate one code if it is lost or shared.

Deploy the bound script as a web app executing as the owner and available to anyone. The access code—not the public URL—is the bearer credential. Copy the `/exec` deployment URL into both the `Lookup service` setting and the public app configuration.
