import BoardGame from "@/components/board";
import StoreProvider from "./StoreProvider";

export default function Home() {
  return (
    <StoreProvider>
      <main>
        <BoardGame />
      </main>
    </StoreProvider>
  );
}
