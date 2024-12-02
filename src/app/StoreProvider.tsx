"use client";
import { AppStore, makeStore } from "@/lib/store";
import { useRef } from "react";
import { Provider } from "react-redux";

export type StoreProviderProps = {
  children: React.ReactNode;
};

function StoreProvider(props: StoreProviderProps) {
  const { children } = props;

  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}

export default StoreProvider;
