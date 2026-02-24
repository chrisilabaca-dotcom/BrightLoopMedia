import React from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { Router } from "wouter";

export function render(url: string) {
    const html = renderToString(
        <React.StrictMode>
            <Router ssrPath={url}>
                <App />
            </Router>
        </React.StrictMode>
    );
    return { html };
}
