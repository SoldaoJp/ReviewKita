import { getStaticReports } from "../services/llmReportsService";

export const filterReports = (filter, query) => {
  let reports = getStaticReports();

  if (filter === "Model Name" && query) {
    reports = reports.filter((r) =>
      r.llm_name.toLowerCase().includes(query.toLowerCase())
    );
  } else if (filter === "Email" && query) {
    reports = reports.filter((r) =>
      r.user_email.toLowerCase().includes(query.toLowerCase())
    );
  } else if (filter === "Sort Ascending") {
    reports = reports.sort((a, b) =>
      a.created_at.localeCompare(b.created_at)
    );
  } else if (filter === "Sort Descending") {
    reports = reports.sort((a, b) =>
      b.created_at.localeCompare(a.created_at)
    );
  } else if (filter === "Random") {
    reports = reports.sort(() => Math.random() - 0.5);
  }

  return reports;
};

