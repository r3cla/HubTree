
# HubTree - GitHub File Structure Visualizer

HubTree is a simple web app that lets you explore repository file structures simply by entering the GitHub repo URL. This includes copying the file structure (indented) as plaintext.

## Features

- **Interactive File Tree** - Expandable directory structure with colour-coded icons for different file types (.tsx, .json, .css, etc.)
- **1-Click Download** - Download the entire repo as a ZIP file right from the interface
- **Structure Copy** - Copy the entire file structure with indents to your clipboard in plaintext
- **GitHub PAT Support** - Optionally add a Personal Access Token (PAT) for higher rate limits and private repo access


## GitHub Personal Access Token

By default, HubTree uses the GitHub API unauthenticated, which allows 60 requests per hour. Adding a PAT carries the following benefits:

- **Higher rate limit** - 5,000 requests per hour
- **Private repositories** - Access to your private repos instead of just public ones

⚠ Note: The token is stored <ins>in your browsers local storage</ins> and is only sent to `api.github.com`

For more information about managing and creating a Personal Access Token, read the [GitHub Documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).
## Use Cases

- **Quick Project Evaluation** - Assess open-source projects and libraries without cloning
- **Technical Discussion** - Get project architecture overviews for discussions
- **AI Tool Integration** - Share exact file structures with AI agents for more accurate project context


## Roadmap

**One Day (Maybe):** 
- GitLab support
- Export structure to diagram
- Search/filter
- Toggle hide file extensions

**Complete:**
- Authenticated API support ✔️
- Expand All, Collapse All buttons ✔️
- Display file sizes ✔️
- Show last commit on click ✔️



## Tech Stack

**Client:** 
- React, Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React icons

**Server:** None, calls to API made from browser


## Screenshots

![App Screenshot](https://i.postimg.cc/x8ZzrhR6/image.png)

