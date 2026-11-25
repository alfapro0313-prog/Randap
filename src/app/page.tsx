import { LangProvider } from "@/components/randap/lang-provider";
import { RandapGate } from "@/components/randap/randap-gate";
import { HomeLinksFooter } from "@/components/randap/landing-shared";

export default function Home() {
  return (
    <LangProvider>
      <RandapGate />
      <HomeLinksFooter />
    </LangProvider>
  );
}
