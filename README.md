# Personal Portfolio Website

A clean, professional portfolio built with React and Vite. Designed to showcase projects for junior web developer job applications.

> **Note:** This repository does not include `node_modules`. After cloning, run `npm install` to install all dependencies before starting the dev server.

## 🚀 Quick Start

```bash
# Install dependencies (required after cloning)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header/         # Navigation header
│   ├── Footer/         # Page footer
│   └── ProjectCard/    # Project display card
├── pages/              # Page components
│   ├── Home/           # Landing page
│   ├── About/          # About me section
│   ├── Projects/       # Project showcase
│   └── Contact/        # Contact information
├── data/
│   └── projects.js     # ⭐ PROJECT DATA FILE
├── App.jsx             # Main app component with routing
├── App.css             # App layout styles
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## ➕ Adding a New Project

**You only need to edit ONE file:** `src/data/projects.js`

1. Open `src/data/projects.js`
2. Add a new object to the array:

```javascript
{
  id: 4,  // Increment this number
  slug: "your-project-slug",
  title: "Your Project Title",
  description: "Detailed description for the Projects page.",
  shortDescription: "Brief 1-sentence description for the Home page.",
  techStack: ["React", "JavaScript", "CSS"],
  clientRepo: "https://github.com/yourusername/project",
  serverRepo: "https://github.com/yourusername/project-server",  // Optional
  liveLink: "https://your-project.netlify.app",
  image: yourImageImport,  // Optional - import at top of file
  featured: true  // Optional - set to true to show on Home page
}
```

3. Save the file - your project will appear automatically!

### Adding Project Images

1. Place image files in `src/assets/projects/`
2. Import at the top of `src/data/projects.js`:
   ```javascript
   import myProjectImage from '../assets/projects/my-project.png';
   ```
3. Reference the import in your project object:
   ```javascript
   image: myProjectImage
   ```

## 🎨 Customization

### Personal Information
Update these files with your details:
- `src/pages/Home/Home.jsx` - Name, title, intro
- `src/pages/About/About.jsx` - Your story, skills
- `src/pages/Contact/Contact.jsx` - Email, social links
- `src/components/Header/Header.jsx` - Your name in logo
- `src/components/Footer/Footer.jsx` - Social links
- `index.html` - Page title

### Colors
Edit CSS variables in `src/index.css`:

```css
:root {
  --color-primary: #00cec9;      /* Main accent color */
  --color-primary-dark: #00b894; /* Hover state */
  --color-dark: #2d3436;         /* Text color */
}
```

## 🌐 Deployment to Netlify

### Option 1: Drag & Drop
1. Run `npm run build`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag the `dist` folder

### Option 2: Git Integration
1. Push your code to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`

## 🛠️ Technologies

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Plain CSS** - Styling (no frameworks)

## 📝 Notes for Interviewers

This portfolio demonstrates:
- Component-based architecture
- Props and state management
- Clean file organization
- Responsive design (mobile-first)
- Semantic HTML
- CSS best practices
- Git version control

---

Built with ❤️ during my web development bootcamp journey.
