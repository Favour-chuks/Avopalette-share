import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Button } from "./ui/button";

interface ColorPickerProp {
  color: string;
  onColorChange: any;
}

const ColorPicker = ({ color, onColorChange }: ColorPickerProp) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          style={{ backgroundColor: color, width: "50px", height: "50px" }}
        />
      </PopoverTrigger>
      <PopoverContent>
        <HexColorPicker color={color} onChange={onColorChange} />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
