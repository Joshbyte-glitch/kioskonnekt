import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
export default defineConfig({
    plugins: [
        react(),
        runtimeErrorOverlay(),
        ...(process.env.NODE_ENV !== "production" &&
            process.env.REPL_ID !== undefined
            ? [
                await import("@replit/vite-plugin-cartographer").then((m) => m.cartographer()),
                await import("@replit/vite-plugin-dev-banner").then((m) => m.devBanner()),
            ]
            : []),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "client", "src"),
            "@shared": path.resolve(__dirname, "shared"),
            "@assets": path.resolve(__dirname, "attached_assets"),
        },
    },
    root: path.resolve(__dirname, "client"),
    build: {
        outDir: path.resolve(__dirname, "dist/public"),
        emptyOutDir: true,
    },
    server: {
        host: '127.0.0.1',
        port: 5173,
        // Proxy /api requests to your backend. Change the `target` below if your backend runs elsewhere.
        // Note: the backend you provided uses HTTPS and may use a self-signed cert; set `secure: false`
        // to allow the dev proxy to accept it. This avoids CORS during development.
        proxy: {
            '/api': {
                target: 'https://localhost:7262',
                changeOrigin: true,
                secure: false,
            }
        },
        fs: {
            strict: true,
            deny: ["**/.*"],
        },
    },
});
