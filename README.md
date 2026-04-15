# Luís Castro - Web Developer Portfolio

Developer portfolio with a built-in visual editor for editing content directly on the site. Built with React to handle content management without an external CMS.

## Live

**[luiscastro-webdeveloper.netlify.app](https://luiscastro-webdeveloper.netlify.app/)**

## Key Features

- Visual editor with inline editing (double-click to edit content)
- Overlay-based admin system (no layout shift)
- Context-aware editing tools per page
- Drag-and-drop project reordering
- Image upload and framing system
- Save / discard workflow with draft state
- Real-time preview

## How It Works

- React renders the real site
- Admin tools are injected as overlay UI
- Draft content is edited locally
- Changes are saved to JSON files
- No external CMS or backend required

## Why This Project

Built to explore CMS-like editing inside a React app:

- Edit content directly in context
- No layout shift when toggling edit mode
- UI and editing tools are cleanly separated

## Tech Stack

- React, Vite, JavaScript, CSS, React Router

## Featured Projects

- **DNB Hub**: Full-stack MERN app (JWT auth, CRUD, MongoDB relationships)
- **FoundIt**: React marketplace (search, filtering, sorting, pagination, CRUD)
- **Dancefloor Defender**: Vanilla JS arcade game (logic, leaderboard, localStorage)

## Run Locally

```bash
npm install
npm run dev
```

## Local Admin (Development Only)

Local admin panel at `/admin` for managing portfolio content. Only available in development.

Two tabs:

- **Projects**: Create, edit, delete, reorder projects, upload images, adjust card framing.
- **Site Content**: Visual inline editor that renders real site pages in a scaled viewport. Double-click text to edit, or use structured editors for complex content.

### How to use

```bash
# Start both the dev server and the admin API:
npm run dev:admin

# Or run them separately:
npm run dev       # Vite dev server (frontend)
npm run server    # Admin API server (port 3001)
```

Then open `http://localhost:5173/admin` in your browser.

### Data & Images

- Project data: `public/data/projects.json`
- Site content: `public/data/siteContent.json`
- Project images: `public/projects/<slug>/cover.<ext>`

### Workflow

1. Start the admin with `npm run dev:admin`
2. Open `/admin` and use the **Projects** or **Site Content** tabs
3. Changes are saved directly to `public/data/projects.json`, `public/data/siteContent.json`, and `public/projects/`
4. Commit and push:
   ```bash
   git add public/data/ public/projects/
   git commit -m "Update portfolio content"
   git push
   ```

> **Note:** The deployed site reads static JSON files. There is no remote backend or CMS, all management is local.

## Contact

- LinkedIn: https://www.linkedin.com/in/luiscastrocoding/
- GitHub: https://github.com/wai-coding
- Email: luiscastrocoding@gmail.com


