import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCode } from "@src/api/code/code";
import { CodeLanguage } from "@src/api/models";
import { Button } from "@src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@src/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select";
import { Switch } from "@src/components/ui/switch";
import { Languages } from "@src/constants/languages";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().nonempty("Nome é obrigatório"),
  language: z.nativeEnum(CodeLanguage, {
    required_error: "Linguagem é obrigatória",
    invalid_type_error: "Linguagem inválida",
  }),
  isPrivate: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

type CreateCodeButtonProps = {
  className?: string;
};

export function CreateCodeButton({ className }: CreateCodeButtonProps) {
  const navigate = useNavigate();

  const { isPending, mutateAsync: createCode } = useCreateCode();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    disabled: isPending,
  });

  async function handleSubmit({ name, language, isPrivate }: FormValues) {
    const { id } = await createCode({
      data: {
        language,
        name,
        private: isPrivate,
      },
    });

    navigate(`/codes/${id}/edit`);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={className}>Compartilhe seu utilitário</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crie seu utilitário</DialogTitle>
          <DialogDescription>
            Compartilhe seu utilitário com a comunidade e ajude outras pessoas a
            resolver problemas
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Linguagem */}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Linguagem</FormLabel>
                  <Select
                    disabled={isPending}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {Object.entries(Languages).map(([language, { name }]) => (
                        <SelectItem key={language} value={language}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Privado */}
            <FormField
              control={form.control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Privado</FormLabel>
                  <FormControl>
                    <Switch
                      disabled={isPending}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="ml-auto">
              Criar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
