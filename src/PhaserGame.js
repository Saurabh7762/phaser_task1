import React, { useState, useEffect } from "react";
import Phaser from "phaser";

const PhaserGame = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: {
        preload: preload,
        create: create,
      },
    };

    const game = new Phaser.Game(config);

    function preload() {
      // Load ball sprite
      this.load.image("ball", "path/to/ball/image.png");
    }

    function create() {
      // Add button to start session
      const button = this.add
        .text(400, 50, "Start Session", { fontSize: "24px", fill: "#fff" })
        .setInteractive()
        .on("pointerdown", () => startSession());

      // Initialize session list
      const sessionList = this.add.text(600, 100, "", {
        fontSize: "16px",
        fill: "#fff",
      });

      let sessionId, counterValue;

      const startSession = () => {
        sessionId = generateSessionId();
        counterValue = generateCounterValue();
        setSessions([
          ...sessions,
          { id: sessionId, startTime: new Date(), endTime: null },
        ]);
        updateSessionList();

        // Start countdown timer
        const timer = setTimeout(() => {
          endSession();
          clearInterval(timer);
        }, counterValue * 1000); // Convert counter value to milliseconds

        // Start ball animation
        startBallAnimation();
      };

      const endSession = () => {
        const endTime = new Date();
        setSessions((prevSessions) =>
          prevSessions.map((session) => {
            if (session.id === sessionId) {
              return { ...session, endTime };
            }
            return session;
          })
        );
        updateSessionList();
      };

      const startBallAnimation = () => {
        // Create ball sprite
        const ball = this.add.sprite(400, 300, "ball");
        ball.setOrigin(0.5);

        // Add physics to the ball
        this.physics.add.existing(ball);

        // Set ball velocity for random movement
        ball.body.setVelocity(
          Math.random() * 200 - 100,
          Math.random() * 200 - 100
        );
      };

      const updateSessionList = () => {
        sessionList.setText(
          sessions
            .map(
              (session) =>
                `Session ID: ${
                  session.id
                }, Start Time: ${session.startTime.toLocaleString()}, End Time: ${
                  session.endTime
                    ? session.endTime.toLocaleString()
                    : "Session in progress"
                }`
            )
            .join("\n")
        );
      };

      const generateSessionId = () => {
        // Generate a random session ID
        return Math.random().toString(36).substring(7);
      };

      const generateCounterValue = () => {
        // Generate a random counter value between 30 and 120 seconds
        return Math.floor(Math.random() * (120 - 30 + 1)) + 30;
      };
    }
  }, []); // Empty dependency array ensures this effect runs only once

  return null; // We don't render anything directly from this component
};

export default PhaserGame;
