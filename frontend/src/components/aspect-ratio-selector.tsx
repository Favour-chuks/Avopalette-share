"use client";

import * as React from "react";
import { Check, Proportions } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

// Define the prop type for the component
interface SelectAspectRatioProps {
  aspectRatio: { value: string; label: string }[]; // Array of aspect ratios
  onSelect: (aspectRatio: string) => void; // Callback for selection
}

export function SelectAspectRatio({ aspectRatio, onSelect }: SelectAspectRatioProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("Landscape"); // Default to "Landscape"


  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? "Landscape" : currentValue);
    setOpen(false);
    onSelect(currentValue); // Notify parent about the selection
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between">
          {value
            ? aspectRatio.find((aspectRatio) => aspectRatio.value === value)
                ?.label
            : "Select aspectRatio..."}
          <Proportions className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 z-50">
        <Command>
          <CommandList>
            <CommandEmpty>No aspectRatio found.</CommandEmpty>
            <CommandGroup>
              {aspectRatio.map((aspectRatio) => (
                <CommandItem
                  key={aspectRatio.value}
                  value={aspectRatio.value}
                  onSelect={handleSelect}>
                  {aspectRatio.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === aspectRatio.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}