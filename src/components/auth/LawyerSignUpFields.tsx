
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";

// Case types for lawyers to select from
const CASE_TYPES = [
  { value: "civil", label: "Civil" },
  { value: "criminal", label: "Criminal" },
  { value: "family", label: "Family" },
  { value: "corporate", label: "Corporate" },
  { value: "immigration", label: "Immigration" },
  { value: "tax", label: "Tax" },
  { value: "intellectual_property", label: "Intellectual Property" },
  { value: "real_estate", label: "Real Estate" },
  { value: "labor", label: "Labor" },
  { value: "environmental", label: "Environmental" }
];

interface LawyerSignUpFieldsProps {
  form: UseFormReturn<any>;
}

const LawyerSignUpFields = ({ form }: LawyerSignUpFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="licenseYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year Licensed</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Year you received your license" 
                {...field} 
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="casesHandled"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cases Handled</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Number of cases handled" 
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="casesWon"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cases Won</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Number of cases won" 
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="specialization"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Main Specialization</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your main specialization" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {CASE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-3">
        <FormLabel>Case Types Handled</FormLabel>
        {CASE_TYPES.map((type) => (
          <FormField
            key={type.value}
            control={form.control}
            name={`caseTypes.${type.value}`}
            render={({ field }) => (
              <FormItem key={type.value} className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  {type.label}
                </FormLabel>
              </FormItem>
            )}
          />
        ))}
      </div>
    </>
  );
};

export default LawyerSignUpFields;
