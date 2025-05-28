#!/usr/bin/env python3
"""
Simple HTTP server to serve the CropCast AI frontend
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

# Change to frontend directory
frontend_dir = Path(__file__).parent / "frontend"
os.chdir(frontend_dir)

PORT = 3000

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP request handler with CORS support and SPA routing"""

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        # Handle SPA routing - serve index.html for all routes except static files
        if self.path.startswith('/dashboard') or self.path.startswith('/rainfall') or \
           self.path.startswith('/flood') or self.path.startswith('/soil') or \
           self.path.startswith('/crops'):
            self.path = '/index.html'

        # Handle favicon.ico
        elif self.path == '/favicon.ico':
            self.path = '/favicon.ico'

        # Handle well-known requests (return 404 silently)
        elif self.path.startswith('/.well-known/'):
            self.send_response(404)
            self.end_headers()
            return

        super().do_GET()

def main():
    """Start the frontend server"""
    try:
        with socketserver.TCPServer(("", PORT), CORSHTTPRequestHandler) as httpd:
            print(f"🌐 CropCast AI Frontend Server")
            print(f"📍 Serving at: http://localhost:{PORT}")
            print(f"📁 Directory: {frontend_dir}")
            print(f"🔗 Backend API: http://localhost:8001")
            print(f"🚀 Open http://localhost:{PORT} in your browser")
            print(f"⏹️  Press Ctrl+C to stop")
            print("-" * 50)

            httpd.serve_forever()

    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except OSError as e:
        if e.errno == 10048:  # Port already in use
            print(f"❌ Port {PORT} is already in use")
            print(f"💡 Try a different port or stop the existing server")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
