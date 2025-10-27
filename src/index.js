import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { SearchProvider } from "./user/controllers/context/SearchContext";
import { ReviewerProvider } from "./user/controllers/context/ReviewerContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<SearchProvider>
		<ReviewerProvider>
			<App />
		</ReviewerProvider>
	</SearchProvider>
);

