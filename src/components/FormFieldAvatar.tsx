
import { useRef, useState } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { User } from "lucide-react";

interface FormFieldAvatarProps<
   TFieldValues extends FieldValues = FieldValues,
   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
   control: Control<TFieldValues>
   name: TName
   setSelectedFile: (file: File | null) => void;
}

export function FormFieldAvatar<
   TFieldValues extends FieldValues = FieldValues,
   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
   control,
   name,
   setSelectedFile,
}: FormFieldAvatarProps<TFieldValues, TName>) {

   const fileInputRef = useRef<HTMLInputElement>(null)
   const [key, setKey] = useState(0)


   const handleUpload = () => {
      fileInputRef.current?.click()
   }

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: string | null) => void) => {
      const file = event.target.files?.[0]
      if (file) {
         const reader = new FileReader()
         reader.onload = (e) => {
            onChange(e.target?.result as string)
         }
         reader.readAsDataURL(file)
         setSelectedFile(file);
      }
   }

   const handleRemove = (onChange: (value: string | null) => void) => {
      onChange(null)
      if (fileInputRef.current) {
         fileInputRef.current.value = ""
      }
      // Force a re-render
      setSelectedFile(null);
      setKey((prevKey) => prevKey + 1)
   }

   return (
      <Controller
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem className="flex bg-transparent">
               <FormControl
                  className="w-auto h-fit border-none"
               >
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-16 w-16 rounded-full">
                           <Avatar className="h-16 w-16" key={key}>
                              {field.value ? (
                                 <AvatarImage src={field.value} alt="Avatar" />
                              ) : (
                                 <AvatarFallback className="[&_svg]:size-7">
                                    <User className="w-16 h-16" />
                                 </AvatarFallback>
                              )}
                           </Avatar>
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent
                        className="w-[250px] p-4 rounded-2xl"
                     >
                        <DropdownMenuItem
                           onClick={handleUpload}
                           className="rounded-xl py-3 bg-cardcursor-pointer text-[16px] text-foreground font-semibold"
                        >
                           Upload a photo
                        </DropdownMenuItem>
                        <DropdownMenuItem
                           onClick={() => handleRemove(field.onChange)}
                           className="rounded-xl py-3 text-[16px] font-semibold bg-card text-destructive focus:text-destructive"
                        >
                           Remove current photo
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                     <Input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, field.onChange)}
                        className="hidden"
                     />
                  </DropdownMenu>
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
};

