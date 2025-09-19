import { useParams } from "react-router-dom";

// Custom hook: return URL prefix based on language param
export function usePrefix() {
  const { lng } = useParams(); // get "lng" param from route
  const current = lng === "zh" || lng === "en" ? lng : "en"; // fallback to "en" if invalid
  return `/${current}`; // return prefix like "/en" or "/zh"
}
