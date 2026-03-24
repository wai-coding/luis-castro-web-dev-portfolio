# Luís Castro - Web Developer Portfolio

Personal portfolio showcasing selected projects built with React and the MERN stack.

## Live

https://luiscastro-webdeveloper.netlify.app/

## Tech Stack

- React, Vite, JavaScript, CSS, React Router

## Featured Projects

- **DNB Hub** - Full-stack MERN (JWT auth, CRUD, MongoDB relationships)
- **FoundIt** - React marketplace (search, filtering, sorting, pagination, CRUD)
- **Dancefloor Defender** - Vanilla JS arcade game (logic, leaderboard, localStorage)

## Run Locally

```bash
npm install
npm run dev
```

## Local Admin (Development Only)

The project includes a local admin panel at `/admin` for managing projects (create, edit, delete, image upload, card image framing). This route is **only available in development** and is excluded from production builds.

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
- Project images: `public/projects/<slug>/cover.<ext>`

### Workflow

1. Start the admin with `npm run dev:admin`
2. Open `/admin` and create/edit/delete projects
3. Changes are saved directly to `public/data/projects.json` and `public/projects/`
4. Commit and push:
   ```bash
   git add public/data/projects.json public/projects/
   git commit -m "Update projects"
   git push
   ```

> **Note:** The deployed site reads `projects.json` as a static file. There is no remote backend or CMS - all management is local.

## Contact

- LinkedIn: https://www.linkedin.com/in/luiscastrocoding/
- GitHub: https://github.com/wai-coding
- Email: luiscastrocoding@gmail.com
