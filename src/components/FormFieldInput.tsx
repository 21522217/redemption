/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control, Controller } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "./ui/separator";

interface FormFieldInputProps {
   control?: Control<any>;
   name: string;
   label?: string;
   placeholder?: string;
   type?: string;
   value?: string;
   disabled?: boolean;
   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormFieldInput: React.FC<FormFieldInputProps> = ({
   control,
   name,
   label,
   placeholder,
   type = "text",
   value,
   disabled,
   onChange,
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
                     <div className="flex flex-col w-full">
                        <Input
                           {...field}
                           type={type}
                           disabled={disabled}
                           placeholder={placeholder}
                           autoComplete="off"
                           className="bg-card focus-visible:ring-0 text-md "
                        />
                        <Separator />
                     </div>
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
      );
   }

   return (
      <FormItem className="flex flex-col justify-between">
         <FormLabel>{label}</FormLabel>
         <FormControl
            className="w-auto h-[40px] border-none"
         >
            <Input
               name={name}
               type={type}
               placeholder={placeholder}
               value={value}
               onChange={onChange}
               className="focus-visible:ring-blue2"
            />
         </FormControl>
      </FormItem>
   );
};