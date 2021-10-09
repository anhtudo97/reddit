import React, { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Wrapper } from "./Wrapper";

interface ILayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<ILayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Wrapper size="regular">{children}</Wrapper>
    </>
  );
};
