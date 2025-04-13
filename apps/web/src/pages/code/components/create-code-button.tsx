import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCode } from "@src/api/code/code";
import { CodeLanguage } from "@src/api/models";
import { CodeEditor } from "@src/components/code-editor";
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
import { useAuthContext } from "@src/global-context/auth/hook";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().nonempty("Nome é obrigatório"),
  language: z.nativeEnum(CodeLanguage, {
    required_error: "Linguagem é obrigatória",
    invalid_type_error: "Linguagem inválida",
  }),
  isPrivate: z.boolean().default(true),
  code: z.string().nonempty("Código é obrigatório"),
});

type FormValues = z.infer<typeof formSchema>;

type CreateCodeButtonProps = {
  className?: string;
};

export function CreateCodeButton({ className }: CreateCodeButtonProps) {
  // Hooks
  const navigate = useNavigate();
  const user = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);

  const { isPending, mutateAsync: createCode } = useCreateCode();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    disabled: isPending,
    defaultValues: {
      isPrivate: true,
      code: "",
    },
  });

  if (user.isLoading || user.user === null) return <></>;

  async function handleSubmit({ name, language, isPrivate, code }: FormValues) {
    const { id } = await createCode({
      data: {
        language,
        name,
        private: isPrivate,
        content: code,
      },
    });

    setIsOpen(false);
    navigate(`/codes/${id}`);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={className}>Compartilhe seu utilitário</Button>
      </DialogTrigger>

      <DialogContent className="h-[80vh] min-w-4xl">
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
            className="flex h-full flex-1 flex-col gap-4"
          >
            <div className="flex items-start gap-4">
              {/* Nome */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
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
                  <FormItem className="flex-1">
                    <FormLabel>Linguagem</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isPending}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          {Object.entries(Languages).map(
                            ([language, { name }]) => (
                              <SelectItem key={language} value={language}>
                                {name}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Privado */}
              <FormField
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <FormItem className="mt-8">
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Switch
                          disabled={isPending}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="m-0">Privado</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Editor de Código */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <CodeEditor
                      language={form.watch("language") || "JavaScript"}
                      value={field.value}
                      onChange={field.onChange}
                      options={{ automaticLayout: true }}
                      className="h-full min-h-[300px]"
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
