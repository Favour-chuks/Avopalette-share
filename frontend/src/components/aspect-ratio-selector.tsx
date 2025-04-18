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

export const SelectAspectRatio = React.memo(function SelectAspectRatio({
  aspectRatio,
  onSelect,
}: SelectAspectRatioProps) {
  const [open, setOpen] = React.useState(false);

  // Default to "Landscape" or the first item in the aspectRatio array
  const defaultValue =
    aspectRatio.find((r) => r.label === "Landscape")?.value ||
    aspectRatio[0]?.value ||
    "";
  const [value, setValue] = React.useState(defaultValue);

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      const newValue = currentValue === value ? defaultValue : currentValue;
      setValue(newValue);
      setOpen(false);
      onSelect(newValue);
    },
    [value, defaultValue, onSelect]
  );

  const selectedLabel = React.useMemo(() => {
    return (
      aspectRatio.find((r) => r.value === value)?.label ??
      "Select aspectRatio..."
    );
  }, [aspectRatio, value]);

  const renderedOptions = React.useMemo(
    () =>
      aspectRatio.map((aspectRatio) => (
        <CommandItem
          key={aspectRatio.value}
          value={aspectRatio.value}
          onSelect={handleSelect}>
          {aspectRatio.label}
          <Check
            className={cn(
              "ml-auto",
              value === aspectRatio.value ? "opacity-100" : "opacity-0"
            )}
          />
        </CommandItem>
      )),
    [aspectRatio, handleSelect, value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between">
          {selectedLabel}
          <Proportions className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 z-50">
        <Command>
          <CommandList>
            <CommandEmpty>No aspectRatio found.</CommandEmpty>
            <CommandGroup>{renderedOptions}</CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
