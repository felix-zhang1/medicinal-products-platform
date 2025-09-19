import { redirect, type LoaderFunctionArgs } from "react-router";

export async function loader(_args: LoaderFunctionArgs) {
  throw redirect("/en");
}
export default function RedirectToEn() {
  return null;
}
