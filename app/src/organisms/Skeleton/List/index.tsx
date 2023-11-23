import { Stack } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { TItem } from "./types";
import ListRoot from "./ListRoot";

function List({ darkMode, noOfItems = 1, containerStyle, ...rest }: TItem) {
  const noOfRow = new Array(noOfItems).fill("");

  const renderRow = () =>
    noOfRow.map((row) => (
      <ListRoot variant="rounded" key={uuidv4()} {...rest} ownerState={{ darkMode }}>
        {row}
      </ListRoot>
    ));

  return (
    <Stack spacing={1} sx={containerStyle}>
      {renderRow()}
    </Stack>
  );
}

export default List;
