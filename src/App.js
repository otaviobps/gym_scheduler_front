import React from "react";
import Routes from "./routes";
import { CssBaseline } from "@material-ui/core";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
    return (
        <div className="App">
            <ErrorBoundary>
                <CssBaseline />
                <Routes />
            </ErrorBoundary>
        </div>
    );
}

export default App;
