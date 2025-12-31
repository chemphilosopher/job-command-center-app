#!/usr/bin/env python3
"""
Job Command Center App Launcher
Double-click or run this script to launch the app.
"""

import subprocess
import webbrowser
import time
import os

PORT = 5173

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    # Install dependencies if node_modules doesn't exist
    if not os.path.exists(os.path.join(script_dir, "node_modules")):
        print("Installing dependencies...")
        subprocess.run(["npm", "install"], check=True)

    print("Starting Job Command Center...")

    # Start the Vite dev server
    process = subprocess.Popen(
        ["npm", "run", "dev"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT
    )

    # Wait for server to start
    time.sleep(3)

    # Open browser
    url = f"http://localhost:{PORT}"
    print(f"Opening {url}")
    webbrowser.open(url)

    print("App is running. Close this window or press Ctrl+C to stop.")

    try:
        process.wait()
    except KeyboardInterrupt:
        print("\nShutting down...")
        process.terminate()

if __name__ == "__main__":
    main()
