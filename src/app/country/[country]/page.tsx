import { redirect, notFound } from "next/navigation";
import { COUNTRIES } from "@/data/countries";

const VALID_COUNTRIES = new Set(Object.keys(COUNTRIES));

type Props = {
  params: Promise<{ country: string }>;
};

export default async function CountryPage({ params }: Props) {
  const { country } = await params;
  const c = country.toLowerCase();
  if (!VALID_COUNTRIES.has(c)) notFound();
  redirect(`/?country=${c}`);
}
