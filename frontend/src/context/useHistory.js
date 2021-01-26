import React, { useState, createContext, useContext } from "react";
const HistoryContext = createContext();
export const useHistoryContext = () => useContext(HistoryContext);
export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  return (
    <HistoryContext.Provider
      value={{
        ...history,
        setHistory: ({ newhistory }) =>
          setHistory([...history, { newhistory }]),
      }}
    >
      >{children}
    </HistoryContext.Provider>
  );
};
