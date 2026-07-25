<div align="center">

<img src="./assets/solaris-network-emblem.png" alt="Solaris Network emblem" width="120">

# Solaris Tactics Grid - Tic Tac Toe

### Strategic Simulation Module

A responsive, dual-theme cyber-solar strategy game that transforms classic Tic Tac Toe into a nine-node training protocol for Solaris Network operators.

[![HTML5](https://img.shields.io/badge/HTML5-semantic-E34F26?logo=html5&logoColor=white)](./index.html)
[![CSS3](https://img.shields.io/badge/CSS3-responsive-1572B6?logo=css3&logoColor=white)](./style.css)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=111)](./script.js)
[![The Odin Project](https://img.shields.io/badge/The_Odin_Project-Tic_Tac_Toe-A9792B)](https://www.theodinproject.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-2ea44f.svg)](#license)

</div>

---

## Preview

![Solaris Tactics Grid - Tic Tac Toe interface preview](./assets/tictactoe_preview.png)

---

## Overview

**Solaris Tactics Grid - Tic Tac Toe** is a browser-based strategic simulator developed for [The Odin Project](https://www.theodinproject.com/) Tic Tac Toe assignment.

Rather than presenting the experience as a conventional game of Xs and Os, the project places two Solaris Network factions in control of a tactical grid:

- **Solar Core** — represented by a radiant gold solar sigil.
- **Lunar Shadow** — represented by a luminous cyan eclipse sigil.

The project focuses on object-oriented JavaScript concepts, encapsulated state, separation of concerns, DOM rendering, responsive interface design, accessible interaction patterns, and persistent interface preferences—all without a framework or external runtime dependency.

---

## Key Features

- **Two-player local simulation** with editable operator names.
- **Nine-node tactical grid** with coordinate labels from `A1` to `C3`.
- **Faction-specific markers** instead of conventional handwritten X and O symbols.
- **Alternating turn management** between Solar Core and Lunar Shadow.
- **Occupied-node protection** that prevents a player from replacing an existing move.
- **Complete outcome detection** for all eight winning combinations and tactical stalemates.
- **Live simulation feedback** through status messages, operator indicators, and turn telemetry.
- **Recent-move and victory highlighting** for clear visual feedback.
- **Start, restart, and operator-reset controls** with distinct responsibilities.
- **Keyboard navigation** across available grid nodes.
- **Solar and Lunar interface modes** with distinct visual environments:
  - Lunar Mode uses the original deep-space mission-control HUD.
  - Solar Mode combines a luminous champagne-gold environment with obsidian command glass, cyan energy accents, and controlled luxury glow.
- **Persistent theme preference** stored locally and restored on future visits.
- **State-safe theme switching** that does not interrupt an active simulation or reset the board.
- **Accessible theme control** with dynamic labels, `aria-pressed`, and synchronized browser theme color.
- **Responsive expanded module heading** for `TACTICS GRID - TIC TAC TOE` without colliding with the system controls.
- **Responsive layout** for desktop, tablet, and mobile screens.
- **Developer signature footer** with a dynamic copyright year and animated GitHub and LinkedIn profile links.
- **Accessible HTML structure** with labels, alternative text, focus states, and ARIA attributes.
- **Encapsulated JavaScript architecture** with minimal global code.

---

## Tech Stack

| Category | Technology | Purpose |
| --- | --- | --- |
| Structure | HTML5 | Semantic interface, forms, controls, and accessible content |
| Styling | CSS3 | Responsive layouts, glass panels, HUD effects, animations, and design tokens |
| Logic | Vanilla JavaScript (ES6+) | Game state, turn flow, outcome detection, rendering, events, theme persistence, and dynamic footer content |
| Layout | CSS Grid and Flexbox | Three-column desktop composition and responsive reflow |
| Typography | Orbitron and Inter | Futuristic headings and readable interface text |
| Assets | PNG and inline SVG | Solaris branding, faction sigils, and interface icons |
| Browser APIs | DOM API and Web Storage API | Interface rendering, events, and local theme preference |
| Version control | Git and GitHub | Source control, commit history, and collaboration |
| Deployment | GitHub Pages | Static production hosting |
| Development | Visual Studio Code | Editing, debugging, and local development |

No JavaScript framework, package manager, backend, database, or build pipeline is required.

---

## Getting Started

### Prerequisites

To run the project locally, you need:

- A modern browser such as Chrome, Firefox, Edge, or Safari.
- [Git](https://git-scm.com/) for cloning the repository.
- Optionally, [Visual Studio Code](https://code.visualstudio.com/) with the Live Server extension.
- Optionally, Python 3 for a lightweight local development server.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/progritit/Tic-Tac-Toe.git
   ```

2. Enter the project directory:

   ```bash
   cd Tic-Tac-Toe
   ```

3. Start a local server with Python:

   ```bash
   python3 -m http.server 5500
   ```

4. Open the application:

   ```text
   http://localhost:5500
   ```

You can also open `index.html` directly or launch the project using the VS Code Live Server extension.

### Environment Variables

This project does not require environment variables or sensitive configuration.

---

## Usage

1. Enter or edit the Solar Core and Lunar Shadow operator names.
2. Use the Sun/Moon control in the system bar to choose **Solar Mode** or **Lunar Mode**. The preference is saved automatically.
3. Select **Initialize Protocol** to activate the simulation.
4. Choose an available grid node when your faction is active.
5. Continue alternating turns until a faction secures three aligned nodes or the grid reaches a stalemate.
6. Select **Restart Simulation** to clear the grid while keeping the current operators.
7. Select **Reset Operators** to restore the default names and return the module to standby.

The theme can be changed before, during, or after a simulation without affecting the board, operators, turn history, or result.

### Default Operators

| Faction | Operator | Marker |
| --- | --- | --- |
| Solar Core | Operator Helios | Solar sigil |
| Lunar Shadow | Operator Nyx | Eclipse sigil |

---

## Architecture

The JavaScript is organized around a factory function and single-instance modules. This keeps state private, limits global code, and gives each part of the application a clear responsibility.

| Component | Pattern | Responsibility |
| --- | --- | --- |
| `createPlayer()` | Factory function | Creates player objects with a name, marker, and faction |
| `Gameboard` | IIFE module | Owns the private nine-cell array and validates marker placement |
| `GameController` | IIFE module | Controls turns, players, wins, stalemates, and simulation phases |
| `ThemeController` | IIFE module | Applies Solar or Lunar Mode, updates accessible control state, synchronizes browser theme color, and stores the selected preference |
| `FooterController` | IIFE module | Inserts the current year into the developer signature |
| `DisplayController` | IIFE module | Renders state, updates the DOM, and handles user interactions |

### State Flow

```text
User interaction
      ↓
DisplayController
      ↓
GameController
      ↓
Gameboard
      ↓
Updated state rendered to the DOM
```

`ThemeController` operates independently from the game-state pipeline. This separation allows the visual environment to change without mutating the board or interrupting the simulation.

### Project Structure

```text
Tic-Tac-Toe/
├── assets/
│   ├── lunar-shadow-sigil.png
│   ├── solar-core-sigil.png
│   ├── solaris-network-emblem.png
│   └── tictactoe_preview.png
├── index.html
├── style.css
├── script.js
├── README.md
└── LICENSE
```

---

## Design System

The interface follows the shared visual language of **The Solaris Network** while offering two complementary visual environments.

### Lunar Mode

- Deep navy and near-black cosmic background.
- Emissive dark glass panels and cinematic mission-control depth.
- Solar-gold faction highlights and cyan system telemetry.
- Restrained atmospheric glow against the dark environment.

### Solar Mode

- Luminous champagne-gold and pale cyan environmental lighting.
- Deep obsidian command panels that preserve contrast and interface depth.
- Brighter gold edging, controlled cyan energy glow, and metallic shadows.
- A premium daylight Solaris identity rather than a simple color inversion.

### Shared design language

- Angular clipped corners and geometric interface elements.
- Subtle grid textures, orbit lines, waveforms, and atmospheric effects.
- Orbitron typography for headings and Inter for controls and body copy.
- CSS custom properties for theme tokens, faction colors, borders, and glow effects.
- Responsive system-bar proportions that accommodate the expanded `TACTICS GRID - TIC TAC TOE` heading.
- High contrast, generous spacing, and restrained animation.

The interface is intentionally optimistic and sophisticated rather than dystopian, retro-arcade, or excessively neon.

---

## Accessibility

Accessibility-conscious implementation details include:

- Semantic landmarks such as `header`, `main`, `section`, `nav`, and `footer`.
- Explicit labels for operator-name fields.
- Descriptive `aria-label` values for interactive grid nodes.
- Live status announcements using `aria-live`.
- Visible keyboard focus styles.
- Arrow-key navigation between available nodes.
- An accessible theme button with a descriptive action label and synchronized `aria-pressed` state.
- Theme switching that preserves the current simulation state.
- Meaningful alternative text for faction artwork.
- Empty alternative text for decorative imagery.
- Reduced animation when `prefers-reduced-motion` is enabled.
- Developer social links with explicit accessible names.
- External links opened in a new tab and protected with `rel="noopener noreferrer"`.

---

## Running Tests

The project currently uses manual browser testing rather than an automated test framework.

### JavaScript syntax check

If Node.js is available, verify the JavaScript syntax with:

```bash
node --check script.js
```

### Recommended manual test scenarios

| Scenario | Expected result |
| --- | --- |
| Initialize the protocol | Solar Core becomes active and all empty nodes become selectable |
| Select an occupied node | The existing marker remains unchanged |
| Solar moves `A1`, `B2`, `C3` | Solar Core secures the grid and the diagonal is highlighted |
| Complete nine moves without a winning line | The simulation reports a tactical stalemate |
| Restart the simulation | The board and turn history reset while operator names remain |
| Reset operators | Default names return and the module enters standby |
| Enter custom operator names | Names appear in simulation messages and remain locked during play |
| Navigate with the keyboard | Focus moves between available nodes |
| Switch to Solar Mode | The warm luminous environment and high-contrast luxury HUD are applied |
| Switch themes during a game | Board state, operators, active turn, and move history remain unchanged |
| Reload after selecting a theme | The most recently selected theme is restored |
| Inspect the theme control | Its label, `aria-pressed` value, and browser theme color reflect the active mode |
| Check the footer | The current year is displayed and both social links open the correct external profiles |
| View the expanded desktop heading | The title and theme control remain separated without overlap |
| Resize the viewport | Panels reflow without overlapping controls or board content |

Before deployment, test the current versions of Chrome and Firefox and verify at least one mobile viewport.

---

## Deployment

Because the project is fully static, it can be deployed directly with GitHub Pages.

1. Push the project to the `main` branch:

   ```bash
   git push origin main
   ```

2. Open the repository on GitHub.
3. Navigate to **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` directory.
6. Save the configuration.

No build command or environment configuration is required. GitHub Pages serves `index.html` directly from the repository root.

---

## Contributing

Contributions, issue reports, and improvement suggestions are welcome.

1. Fork the repository.
2. Create a focused branch:

   ```bash
   git checkout -b feature/short-description
   ```

3. Make and test your changes.
4. Use a clear Conventional Commit message:

   ```bash
   git commit -m "feat: describe the improvement"
   ```

5. Push your branch:

   ```bash
   git push origin feature/short-description
   ```

6. Open a pull request describing:
   - What changed.
   - Why the change is useful.
   - How the change was tested.
   - Any visual or accessibility impact.

Keep pull requests focused and avoid including unrelated formatting or refactoring changes.

---

## Author

**Clebson Costa — Clebson Web Dev**

- GitHub: [@progritit](https://github.com/progritit)
- LinkedIn: [clebsoncosta](https://www.linkedin.com/in/clebsoncosta)
- Portfolio: [progritit.github.io/Portfolio](https://progritit.github.io/Portfolio/)

---

## Acknowledgements

- [The Odin Project](https://www.theodinproject.com/) for the curriculum and project specification.
- [Google Fonts](https://fonts.google.com/) for Orbitron and Inter.
- The broader **Solaris Network** project roadmap for the connected product concept.
- AI-assisted workflows used during visual exploration, asset generation, planning, and implementation review.

---

## License

This project is distributed under the **MIT License**. See the [`LICENSE`](./LICENSE) file for details.
