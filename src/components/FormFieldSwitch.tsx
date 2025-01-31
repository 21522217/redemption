/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control, Controller } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface FormFieldSwitchProps {
   control?: Control<any>;
   name: string;
   label?: string;
   description: string;
}

export const FormFieldSwitch: React.FC<FormFieldSwitchProps> = ({
   control,
   name,
   label,
   description,
}) => {
   if (control) {
      return (
         <Controller
            control={control}
            name={name}
            render={({ field }) => (
               <FormItem className="flex flex-col flex-1 justify-between bg-transparent">
                  <FormLabel
                     className="font-medium text-md"
                  >
                     {label}
                  </FormLabel>
                  <FormControl
                     className="w-auto h-fit border-none"
                  >
                     <div className="flex flex-row w-full">
                        <Label className="flex-1 text-[12px] text-accent-foreground">
                           {description}
                        </Label>
                        <Switch
                           checked={field.value}
                           onCheckedChange={field.onChange}
                        />
                     </div>
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
      );
   }
};