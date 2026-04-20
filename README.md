
## The App
GitHub File Structure Visualizer (HubTree) is a simple web app that lets you explore repository file structures by entering a GitHub repo URL.

## Features
- **Interactive File Tree:** Expandable directory structure with color-coded icons for different file types (.tsx, .json, .css, etc.)
- **One-Click Download:** Download the entire repository as a ZIP file directly from the interface
- **Structure Copy:** Copy the entire file structure to clipboard in plaintext with one click
- **GitHub Token Support:** Optionally add a Personal Access Token (PAT) for higher rate limits and private repo access

## GitHub Personal Access Token (PAT)

By default, HubTree uses the GitHub API unauthenticated, which allows **60 requests per hour**. Adding a PAT unlocks several benefits:

- **Higher rate limit:** 5,000 requests per hour instead of 60
- **Private repositories:** Browse the file structure of your own private repos
- **More reliable commit info:** Each file click fetches a commit — the default limit runs out fast on larger repos

### How to create a PAT

1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Click **Generate new token (classic)**
3. Give it a name (e.g. `hubtree`)
4. Select scopes:
   - `public_repo` — for public repos only
   - `repo` — to also access private repos
5. Click **Generate token** and copy it

Then click the key icon ( 🔑 ) in HubTree and paste your token. It is saved to your browser's local storage and is only ever sent to `api.github.com`.

## Use Cases
- **Quick Project Evaluation**: Instantly assess open-source projects and libraries without cloning
- **Technical Interviews**: Get rapid project architecture overviews for discussions
- **AI Tool Integration**: Share exact file structures with AI agents and tools for more accurate project context
- **Private Repo Exploration**: Browse your own private repositories with a PAT
  
## Roadmap
### ASAP
- Nothing atm
### Maybe Later
- Select and copy specific file paths
- Search/filter function
- Toggle to hide certain folders such as .github
- GitLab support
- Export to diagram
### In Progress or Complete
- Add icons for different file types *(in progress)*
  - Shortlist: `.npmrc, .vscodeignore, .vsconfig, .filter, .mp3, .config, .htm, .asset, .xsd, .dll, .txt, .log, .meta, .unity`
- Expand All, Collapse All buttons ✔️
- Show last commit info for each file on ~~hover~~ click ✔️
- Display file sizes ✔️
  
## Tech Stack

### Frontend
React 19.0.0, Next.js 15.1.4, TypeScript 5.7.3, Tailwind CSS 3.4.17, shadcn/ui, Radix UI, Lucide React
### Development
VS Code


