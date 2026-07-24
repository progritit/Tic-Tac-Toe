(() => {
  "use strict";

  const DEFAULT_NAMES = {
    solar: "Operator Helios",
    lunar: "Operator Nyx",
  };

  const MARKER_ASSETS = {
    solar: "./assets/solar-core-sigil.png",
    lunar: "./assets/lunar-shadow-sigil.png",
  };

  const GRID_COORDINATES = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];

  /**
   * Player factory
   * Creates the two operator objects used by the game controller.
   */
  function createPlayer(name, marker, faction) {
    return {
      name,
      marker,
      faction,
    };
  }

  /**
   * Gameboard module
   * Owns the private nine-cell array and exposes only the operations the game needs.
   */
  const Gameboard = (() => {
    let board = Array(9).fill(null);

    const getBoard = () => [...board];

    const placeMarker = (cellIndex, marker) => {
      const isValidIndex = Number.isInteger(cellIndex) && cellIndex >= 0 && cellIndex < board.length;

      if (!isValidIndex || board[cellIndex] !== null) {
        return false;
      }

      board[cellIndex] = marker;
      return true;
    };

    const reset = () => {
      board = Array(9).fill(null);
    };

    const isFull = () => board.every((cell) => cell !== null);

    return {
      getBoard,
      placeMarker,
      reset,
      isFull,
    };
  })();

  /**
   * Game controller module
   * Owns player turns, win/tie detection, and the complete simulation lifecycle.
   */
  const GameController = (() => {
    const WINNING_COMBINATIONS = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    let players = [];
    let activePlayerIndex = 0;
    let phase = "idle";
    let winner = null;
    let winningCombination = [];
    let moveHistory = [];
    let consoleMessage = "TACTICAL LINK STABLE // AWAITING OPERATOR INITIALIZATION";

    const normalizeName = (name, fallback) => {
      const cleanName = name.trim().replace(/\s+/g, " ");
      return cleanName || fallback;
    };

    const getActivePlayer = () => players[activePlayerIndex] ?? null;

    const findWinningCombination = (marker) => {
      const board = Gameboard.getBoard();

      return (
        WINNING_COMBINATIONS.find((combination) =>
          combination.every((cellIndex) => board[cellIndex] === marker),
        ) ?? null
      );
    };

    const getState = () => ({
      board: Gameboard.getBoard(),
      players: players.map((player) => ({ ...player })),
      activePlayer: getActivePlayer() ? { ...getActivePlayer() } : null,
      phase,
      winner: winner ? { ...winner } : null,
      winningCombination: [...winningCombination],
      moveHistory: moveHistory.map((move) => ({ ...move })),
      consoleMessage,
    });

    const startGame = (solarName, lunarName) => {
      players = [
        createPlayer(normalizeName(solarName, DEFAULT_NAMES.solar), "solar", "SOLAR CORE"),
        createPlayer(normalizeName(lunarName, DEFAULT_NAMES.lunar), "lunar", "LUNAR SHADOW"),
      ];

      activePlayerIndex = 0;
      phase = "active";
      winner = null;
      winningCombination = [];
      moveHistory = [];
      Gameboard.reset();
      consoleMessage = `${players[0].name.toUpperCase()} // SOLAR CORE COMMAND LINK ESTABLISHED`;

      return getState();
    };

    const playRound = (cellIndex) => {
      if (phase !== "active") {
        return false;
      }

      const activePlayer = getActivePlayer();
      const moveAccepted = Gameboard.placeMarker(cellIndex, activePlayer.marker);

      if (!moveAccepted) {
        consoleMessage = `${GRID_COORDINATES[cellIndex] ?? "NODE"} UNAVAILABLE // SELECT AN OPEN GRID NODE`;
        return false;
      }

      moveHistory.push({
        cellIndex,
        coordinate: GRID_COORDINATES[cellIndex],
        marker: activePlayer.marker,
        faction: activePlayer.faction,
      });

      const completedLine = findWinningCombination(activePlayer.marker);

      if (completedLine) {
        phase = "won";
        winner = activePlayer;
        winningCombination = completedLine;
        consoleMessage = `${activePlayer.name.toUpperCase()} // ${activePlayer.faction} HAS SECURED THE GRID`;
        return true;
      }

      if (Gameboard.isFull()) {
        phase = "tie";
        consoleMessage = "GRID LOCKED // TACTICAL STALEMATE";
        return true;
      }

      activePlayerIndex = activePlayerIndex === 0 ? 1 : 0;
      const nextPlayer = getActivePlayer();
      consoleMessage = `${nextPlayer.name.toUpperCase()} // ${nextPlayer.faction} COMMAND AUTHORIZED`;

      return true;
    };

    const resetToIdle = () => {
      players = [];
      activePlayerIndex = 0;
      phase = "idle";
      winner = null;
      winningCombination = [];
      moveHistory = [];
      Gameboard.reset();
      consoleMessage = "TACTICAL LINK STABLE // AWAITING OPERATOR INITIALIZATION";

      return getState();
    };

    return {
      getState,
      startGame,
      playRound,
      resetToIdle,
    };
  })();

  /**
   * Display controller module
   * Mirrors controller state into the DOM and owns all user-interface events.
   */
  const DisplayController = (() => {
    const elements = {
      cells: [...document.querySelectorAll(".grid-cell")],
      tacticalGrid: document.querySelector("#tactical-grid"),
      solarName: document.querySelector("#solar-name"),
      lunarName: document.querySelector("#lunar-name"),
      startButton: document.querySelector("#start-button"),
      startButtonLabel: document.querySelector("#start-button-label"),
      resetOperatorsButton: document.querySelector("#reset-operators-button"),
      simulationStatus: document.querySelector("#simulation-status"),
      simulationStateLabel: document.querySelector("#simulation-state-label"),
      turnAnnouncement: document.querySelector("#turn-announcement"),
      messageOutput: document.querySelector("#message-output"),
      solarOperatorState: document.querySelector("#solar-operator-state"),
      lunarOperatorState: document.querySelector("#lunar-operator-state"),
      turnCount: document.querySelector("#turn-count"),
      sequenceTrack: document.querySelector("#sequence-track"),
      currentYear: document.querySelector("#current-year")
    };

    const clearStateClasses = (element) => {
      element.classList.remove("is-active", "is-winner");
    };

    const renderBoard = (state) => {
      const lastMove = state.moveHistory.at(-1);

      elements.cells.forEach((cell, cellIndex) => {
        const markerSlot = cell.querySelector(".marker-slot");
        const marker = state.board[cellIndex];
        const isWinningCell = state.winningCombination.includes(cellIndex);
        const isLastMove = lastMove?.cellIndex === cellIndex;
        const coordinate = GRID_COORDINATES[cellIndex];

        cell.classList.toggle("has-solar", marker === "solar");
        cell.classList.toggle("has-lunar", marker === "lunar");
        cell.classList.toggle("is-winning", isWinningCell);
        cell.classList.toggle("is-last-move", isLastMove);
        cell.disabled = state.phase !== "active" || marker !== null;
        markerSlot.replaceChildren();

        if (marker) {
          const markerImage = document.createElement("img");
          markerImage.className = "cell-marker";
          markerImage.src = MARKER_ASSETS[marker];
          markerImage.alt = "";
          markerSlot.append(markerImage);
          cell.setAttribute(
            "aria-label",
            `${coordinate}, occupied by ${marker === "solar" ? "Solar Core" : "Lunar Shadow"}`,
          );
        } else if (state.phase === "active") {
          cell.setAttribute(
            "aria-label",
            `${coordinate}, empty. Select for ${state.activePlayer.faction}`,
          );
        } else {
          cell.setAttribute("aria-label", `${coordinate}, empty tactical node`);
        }
      });
    };

    const setOperatorState = (element, label, className = "") => {
      clearStateClasses(element);

      if (className) {
        element.classList.add(className);
      }

      element.querySelector(".state-label").textContent = label;
    };

    const renderOperatorPanels = (state) => {
      const gameInProgress = state.phase !== "idle";
      elements.solarName.disabled = gameInProgress;
      elements.lunarName.disabled = gameInProgress;

      if (state.phase === "idle") {
        setOperatorState(elements.solarOperatorState, "READY");
        setOperatorState(elements.lunarOperatorState, "READY");
        return;
      }

      if (state.phase === "active") {
        const solarIsActive = state.activePlayer.marker === "solar";
        setOperatorState(elements.solarOperatorState, solarIsActive ? "ACTIVE" : "STANDBY", solarIsActive ? "is-active" : "");
        setOperatorState(elements.lunarOperatorState, solarIsActive ? "STANDBY" : "ACTIVE", solarIsActive ? "" : "is-active");
        return;
      }

      if (state.phase === "won") {
        const solarWon = state.winner.marker === "solar";
        setOperatorState(elements.solarOperatorState, solarWon ? "GRID SECURED" : "SIMULATION ENDED", solarWon ? "is-winner" : "");
        setOperatorState(elements.lunarOperatorState, solarWon ? "SIMULATION ENDED" : "GRID SECURED", solarWon ? "" : "is-winner");
        return;
      }

      setOperatorState(elements.solarOperatorState, "GRID LOCKED");
      setOperatorState(elements.lunarOperatorState, "GRID LOCKED");
    };

    const renderStatus = (state) => {
      elements.simulationStatus.classList.toggle(
        "is-lunar-turn",
        state.phase === "active" && state.activePlayer.marker === "lunar",
      );
      elements.simulationStatus.classList.toggle(
        "is-complete",
        state.phase === "won" || state.phase === "tie",
      );

      if (state.phase === "idle") {
        elements.simulationStateLabel.textContent = "PROTOCOL STANDBY";
        elements.turnAnnouncement.textContent = "AWAITING OPERATOR INITIALIZATION";
        elements.startButtonLabel.textContent = "INITIALIZE PROTOCOL";
      } else if (state.phase === "active") {
        elements.simulationStateLabel.textContent = "SIMULATION ACTIVE";
        elements.turnAnnouncement.textContent = `${state.activePlayer.faction} TURN // SELECT GRID NODE`;
        elements.startButtonLabel.textContent = "RESTART SIMULATION";
      } else if (state.phase === "won") {
        elements.simulationStateLabel.textContent = "SIMULATION COMPLETE";
        elements.turnAnnouncement.textContent = `${state.winner.faction} HAS SECURED THE GRID`;
        elements.startButtonLabel.textContent = "RESTART SIMULATION";
      } else {
        elements.simulationStateLabel.textContent = "SIMULATION COMPLETE";
        elements.turnAnnouncement.textContent = "GRID LOCKED // TACTICAL STALEMATE";
        elements.startButtonLabel.textContent = "RESTART SIMULATION";
      }

      elements.messageOutput.textContent = state.consoleMessage;
    };

    const renderSequence = (state) => {
      elements.turnCount.textContent = `${String(state.moveHistory.length).padStart(2, "0")} / 09`;
      elements.sequenceTrack.replaceChildren();

      if (state.moveHistory.length === 0) {
        const emptyMessage = document.createElement("span");
        emptyMessage.className = "sequence-empty";
        emptyMessage.textContent = "NO MOVES LOGGED";
        elements.sequenceTrack.append(emptyMessage);
        return;
      }

      state.moveHistory.forEach((move) => {
        const node = document.createElement("span");
        node.className = `sequence-node sequence-node--${move.marker}`;
        node.textContent = move.coordinate;
        node.title = `${move.faction} claimed ${move.coordinate}`;
        elements.sequenceTrack.append(node);
      });
    };

    const render = () => {
      const state = GameController.getState();
      renderBoard(state);
      renderOperatorPanels(state);
      renderStatus(state);
      renderSequence(state);
    };

    const focusNextAvailableCell = (fromIndex) => {
      const state = GameController.getState();

      if (state.phase !== "active") {
        return;
      }

      const nextAvailableIndex = state.board.findIndex(
        (marker, index) => marker === null && index > fromIndex,
      );
      const fallbackIndex = state.board.findIndex((marker) => marker === null);
      const targetIndex = nextAvailableIndex === -1 ? fallbackIndex : nextAvailableIndex;

      if (targetIndex !== -1) {
        requestAnimationFrame(() => elements.cells[targetIndex].focus());
      }
    };

    const handleStart = () => {
      const state = GameController.startGame(elements.solarName.value, elements.lunarName.value);
      elements.solarName.value = state.players[0].name;
      elements.lunarName.value = state.players[1].name;
      render();
      requestAnimationFrame(() => elements.cells[0].focus());
    };

    const handleResetOperators = () => {
      GameController.resetToIdle();
      elements.solarName.value = DEFAULT_NAMES.solar;
      elements.lunarName.value = DEFAULT_NAMES.lunar;
      render();
      elements.solarName.focus();
      elements.solarName.select();
    };

    const handleCellClick = (event) => {
      const cell = event.target.closest(".grid-cell");

      if (!cell) {
        return;
      }

      const cellIndex = Number(cell.dataset.cellIndex);
      const moveAccepted = GameController.playRound(cellIndex);
      render();

      if (moveAccepted) {
        focusNextAvailableCell(cellIndex);
      }
    };

    const handleGridNavigation = (event) => {
      const activeCell = event.target.closest(".grid-cell");

      if (!activeCell || !["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(event.key)) {
        return;
      }

      event.preventDefault();

      const index = Number(activeCell.dataset.cellIndex);
      const row = Math.floor(index / 3);
      const column = index % 3;
      const steps = {
        ArrowUp: [-1, 0],
        ArrowRight: [0, 1],
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
      };
      const [rowStep, columnStep] = steps[event.key];

      for (let distance = 1; distance <= 3; distance += 1) {
        const nextRow = (row + rowStep * distance + 3) % 3;
        const nextColumn = (column + columnStep * distance + 3) % 3;
        const nextIndex = nextRow * 3 + nextColumn;

        if (!elements.cells[nextIndex].disabled) {
          elements.cells[nextIndex].focus();
          break;
        }
      }
    };

    const handleNameFieldKeydown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleStart();
      }
    };

    const init = () => {
      elements.startButton.addEventListener("click", handleStart);
      elements.resetOperatorsButton.addEventListener("click", handleResetOperators);
      elements.tacticalGrid.addEventListener("click", handleCellClick);
      elements.tacticalGrid.addEventListener("keydown", handleGridNavigation);
      elements.solarName.addEventListener("keydown", handleNameFieldKeydown);
      elements.lunarName.addEventListener("keydown", handleNameFieldKeydown);
      if (elements.currentYear) {
        elements.currentYear.textContent = new Date().getFullYear();
      }
      render();
    };

    return {
      init,
    };
  })();

  DisplayController.init();
})();
