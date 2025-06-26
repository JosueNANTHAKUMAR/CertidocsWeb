import ConnectBtn from "@/components/ConnectBtn";
import Image from "next/image";

export default function Home() {
  return (
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <ConnectBtn/>
        </div>
      </main>
  );
}
