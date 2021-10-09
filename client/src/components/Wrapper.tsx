import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

type WrapperSize = "regular" | "small";

interface IWrapperProps {
  children: ReactNode;
  size?: WrapperSize;
}

export const Wrapper: React.FC<IWrapperProps> = ({ children, size }) => {
  return (
    <Box
      maxW={size === "regular" ? "800px" : "400px"}
      w="100%"
      my={8}
      mx="auto"
    >
      {children}
    </Box>
  );
};
