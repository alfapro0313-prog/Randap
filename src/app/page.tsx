import { LangProvider } from "@/components/randap/lang-provider";
import { RandapApp } from "@/components/randap/randap-app";

export default function Home() {
  return (
    <LangProvider>
      <RandapApp />
    </LangProvider>
  );
}
