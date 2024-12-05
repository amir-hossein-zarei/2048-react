import BoardGame from "@/components/board";
import StoreProvider from "./StoreProvider";

export default function Home() {
  return (
    <StoreProvider>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <BoardGame />
      </main>
    </StoreProvider>
  );
}
