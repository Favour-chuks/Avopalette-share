import { Slider } from "@radix-ui/react-slider";
import React, { useState } from "react";

interface DensitySliderProp{
  inheritDensity : number;
}

const DensitySlider: React.FC<DensitySliderProp> = ({inheritDensity}) => {
  const [density, setDensity] = useState(inheritDensity)
  return (
    <div className="flex flex-col gap-[16px] min-h-[58px]">
      <label className="text-sm flex justify-between items-center">
        Density
        <span className="flex justify-center w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
          {density}%
          <input
            className="w-6 justify-center align-center  text-right text-sm text-muted-foreground 
                                     border-0 appearance-none 
                                     focus:outline-none focus:ring-0 focus:border-0 
                                     [&::-webkit-inner-spin-button]:appearance-none 
                                     [&::-webkit-outer-spin-button]:appearance-none 
                                     [&::-moz-appearance:textfield]:appearance-none"
            type="number"
            min={0}
            max={100}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.value.length > 6) {
                e.target.value = e.target.value.slice(0, 6); // Keep only first 3 digits
              }
            }}
            value={density}
            onChange={(e) => {
              setDensity(Number(e.target.value));
            }}
          />
        </span>
      </label>
      <Slider
        defaultValue={[density]}
        max={100000}
        step={1}
        onValueChange={(value) => setDensity(value[0])}
      />
    </div>
  );
}

export default DensitySlider;
 