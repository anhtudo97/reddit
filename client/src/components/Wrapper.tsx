import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

interface IWrapperProps {
  children: ReactNode;
}

export const Wapper = ({ children }: IWrapperProps) => {
  return (
    <Box maxW="400px" w="100%" mt={8} mx="auto">
      {children}
    </Box>
  );
};
