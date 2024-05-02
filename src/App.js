import React, { useState, useEffect } from "react";
import Phaser from "phaser";

const GameScene = ({ initialCounter, onCounterZero }) => {
  useEffect(() => {
    const gameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    const game = new Phaser.Game(gameConfig);

    function preload() {
      this.load.image("background", "/assets/ball.png");
      this.load.audio("clockSound", "/assets/clock_sound.mp3");
    }

  
    function create() {
      // Create your game elements here
      const backgroundImage = this.add.image(400, 300, "background");
      backgroundImage.setScale(0.045);

      // Random initial velocity for the ball (increased for faster movement)
      let velocityX = Phaser.Math.Between(-600, 600);
      let velocityY = Phaser.Math.Between(-600, 600);

      if (initialCounter > 0) {
        this.counter = initialCounter;
        this.counterText = this.add.text(400, 50, "Counter: " + this.counter, {
          fontSize: "32px",
          fill: "#fff",
        });
        this.counterText.setOrigin(0.5);

        // Start countdown timer
        this.timedEvent = this.time.addEvent({
          delay: 1000,
          callback: onTimerTick,
          callbackScope: this,
          loop: true,
        });

        // Rotate the background image
        this.tweens.add({
          targets: backgroundImage,
          angle: 360, // Rotate by 360 degrees
          duration: 2000, // Rotation duration in milliseconds
          repeat: -1, // Repeat indefinitely
        });

        // Move the background image using velocity vectors
        this.time.addEvent({
          delay: 16, // Update every 16ms for smooth motion
          callback: function () {
            // Convert velocity to per-frame movement
            backgroundImage.x += velocityX / 60;
            backgroundImage.y += velocityY / 60;

            // Reflect off the walls
            if (backgroundImage.x < 50 || backgroundImage.x > 750) {
              velocityX *= -1;
            }
            if (backgroundImage.y < 50 || backgroundImage.y > 550) {
              velocityY *= -1;
            }

            // Randomly change direction only when hitting a wall or a corner
            if (
              (backgroundImage.x <= 0 || backgroundImage.x >= 750) &&
              (backgroundImage.y <= 0 || backgroundImage.y >= 550)
            ) {
              velocityX = Phaser.Math.Between(-600, 600);
              velocityY = Phaser.Math.Between(-600, 600);
            }
          },
          callbackScope: this,
          loop: true,
        });
      }
    }





    function update() {
      // Update logic, if any
    }

    function onTimerTick() {
      this.counter -= 1;
      this.counterText.setText("Counter: " + this.counter);
      this.sound.play("clockSound");

      if (this.counter === 0) {
        this.timedEvent.remove();
        this.counterText.destroy(); // Remove counter text when counter is zero
        onCounterZero(); // Notify parent component when counter reaches zero
      }
    }

    return () => {
      // Clean up resources if needed
      game.destroy(true);
    };
  }, [initialCounter, onCounterZero]);

  return <div id="game-container" />;
};

const App = () => {
  const [sessionId, setSessionId] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [initialCounter, setInitialCounter] = useState(0);
  const [sessions, setSessions] = useState([]);

  const startSession = () => {
    const newSessionId = Math.random().toString(36).substring(7);
    setSessionId(newSessionId);
    const randomCounter = Math.floor(Math.random() * (120 - 30 + 1)) + 30;
    setInitialCounter(randomCounter);
    setGameStarted(true);

    // Store session start time
    const startTime = new Date().toLocaleString();
    setSessions([
      ...sessions,
      { sessionId: newSessionId, startTime, endTime: null },
    ]);
  };

  const handleSessionReset = () => {
    setGameStarted(false);
    setInitialCounter(0); // Reset counter to zero

    // Update session end time
    const endTime = new Date().toLocaleString();
    const updatedSessions = sessions.map((session) => {
      if (session.sessionId === sessionId) {
        return { ...session, endTime };
      }
      return session;
    });
    setSessions(updatedSessions);
  };

  return (
    <div className="panel">
      <div className="left-panel">
        <h1>Game Session: {sessionId}</h1>
        <GameScene
          initialCounter={initialCounter}
          onCounterZero={handleSessionReset}
        />
        {!gameStarted && <button onClick={startSession}>Start Session</button>}
      </div>
      <div className="right-panel">
        <h2>Sessions:</h2>
        <table>
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, index) => (
              <tr key={index}>
                <td>{session.sessionId}</td>
                <td>{session.startTime}</td>
                <td>{session.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
