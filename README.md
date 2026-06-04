# CardioConnect Future-State Mobile Prototype

Increment 1 of a mobile-first, One Cardiology concept experience for the Boston Scientific QBR proactive pitch.

## Included in this build

- Monica Torres Clinical Manager home briefing
- CRM, EP, and Watchman priority references
- Urgent ICD coverage workflow
- Contextual CardioConnect Assist bottom-sheet interaction
- Javier Ruiz recommendation, selection, and assignment confirmation
- Updated case readiness and resolved home state
- External concept persona selector with future role placeholders
- Lightweight tab placeholders for future increments

## Run locally

This prototype uses Next.js App Router, TypeScript, and CSS modules. Node.js 20.9 or newer is required by current Next.js documentation.

1. Open Terminal in VS Code.
2. Navigate to this project folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser.

## Click path for the current walkthrough

1. Start on Monica's briefing screen.
2. Select **Find coverage** on the CRM ICD Implant card.
3. Select **Find qualified coverage**.
4. Select the suggested prompt in Assist.
5. Choose **Select Javier**.
6. Select **Confirm assignment**.
7. Review the connected handoff and updated readiness state.
8. Select **Return to briefing** to see the resolved coverage state.

## Files to edit during iteration

- `app/page.tsx` — content, screen states, and interactions
- `app/page.module.css` — visual styling and layout
- `app/globals.css` — brand tokens and global font/background styling

## Notes

- No backend, login, actual AI, scanner, or real case data is included.
- SST is referenced as the preferred first font in CSS but is not included in this package. The app uses approved-friendly system fallbacks unless SST is available locally.
- No Boston Scientific logo asset is embedded; the in-app `CardioConnect` lockup is text-based for the initial concept build.
# cardioconnect-future-state
