import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { SearchProvider } from "./context/SearchContext";
import { ReviewerProvider } from "./context/ReviewerContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<SearchProvider>
		<ReviewerProvider>
			<App />
		</ReviewerProvider>
	</SearchProvider>
);
