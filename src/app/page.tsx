import { LangProvider } from "@/components/randap/lang-provider";
import { RandapGate } from "@/components/randap/randap-gate";

export default function Home() {
  return (
    <LangProvider>
      <RandapGate />
    </LangProvider>
  );
}
