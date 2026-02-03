import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders catalog header", () => {
  render(<App />);
  expect(screen.getByText(/Catalog/i)).toBeInTheDocument();
});
