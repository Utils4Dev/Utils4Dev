import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCode } from "@src/api/code/code";
import { CodeLanguage } from "@src/api/models";
import { ExtendedCreateCodeDto } from "@src/api/models/extended-types";
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
  FormDescription,
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
import { Textarea } from "@src/components/ui/textarea";
import { Languages } from "@src/constants/languages";
import { useAuthContext } from "@src/global-context/auth/hook";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { z } from "zod";

const MAX_DESCRIPTION_LENGTH = 250;
const MAX_KEYWORDS_COUNT = 5;

const formSchema = z.object({
  name: z.string().nonempty("Nome é obrigatório"),
  language: z.nativeEnum(CodeLanguage, {
    required_error: "Linguagem é obrigatória",
    invalid_type_error: "Linguagem inválida",
  }),
  isPrivate: z.boolean().default(true),
  code: z.string().nonempty("Código é obrigatório"),
  keywords: z
    .string()
    .refine(
      (val) =>
        val === "" ||
        val.split(",").filter(Boolean).length <= MAX_KEYWORDS_COUNT,
      `Limite máximo de ${MAX_KEYWORDS_COUNT} palavras-chave`,
    )
    .optional(),
  description: z
    .string()
    .max(
      MAX_DESCRIPTION_LENGTH,
      `A descrição deve ter no máximo ${MAX_DESCRIPTION_LENGTH} caracteres`,
    )
    .optional(),
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
  const [keywordsCount, setKeywordsCount] = useState(0);
  const [descriptionLength, setDescriptionLength] = useState(0);

  const { isPending, mutateAsync: createCode } = useCreateCode();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    disabled: isPending,
    defaultValues: {
      isPrivate: true,
      code: "",
      keywords: "",
      description: "",
    },
  });

  // Monitorar e atualizar contagem de palavras-chave
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "keywords") {
        const keywordsValue = value.keywords || "";
        const count =
          keywordsValue === ""
            ? 0
            : keywordsValue.split(",").filter((k) => k.trim()).length;
        setKeywordsCount(count);
      }

      if (name === "description") {
        setDescriptionLength((value.description || "").length);
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch]);

  if (user.isLoading || user.user === null) return <></>;

  async function handleSubmit({
    name,
    language,
    isPrivate,
    code,
    keywords,
    description,
  }: FormValues) {
    // Converte a string de palavras-chave em um array
    const keywordsArray = keywords
      ? keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
          .slice(0, MAX_KEYWORDS_COUNT)
      : [];

    const { id } = await createCode({
      data: {
        language,
        name,
        private: isPrivate,
        content: code,
        keywords: keywordsArray,
        description: description?.slice(0, MAX_DESCRIPTION_LENGTH),
      } as ExtendedCreateCodeDto,
    });

    setIsOpen(false);
    navigate(`/codes/${id}`);
  }

  // Cálculos para os indicadores visuais
  const isKeywordsLimitReached = keywordsCount >= MAX_KEYWORDS_COUNT;
  const isDescriptionNearLimit =
    descriptionLength > MAX_DESCRIPTION_LENGTH * 0.9;

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
            className="flex h-full flex-1 flex-col gap-4 overflow-y-auto"
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

            {/* Palavras-chave */}
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Palavras-chave (separadas por vírgula)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="ex: javascript, promise, async, util"
                    />
                  </FormControl>
                  <FormDescription className="flex justify-end text-xs">
                    <span
                      className={`${isKeywordsLimitReached ? "font-medium text-red-500" : ""}`}
                    >
                      {keywordsCount}/{MAX_KEYWORDS_COUNT}
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descrição */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Uma breve descrição do seu código e como ele pode ajudar outras pessoas"
                      className="resize-none"
                      rows={3}
                      maxLength={MAX_DESCRIPTION_LENGTH}
                    />
                  </FormControl>
                  <FormDescription className="flex justify-end text-xs">
                    <span
                      className={
                        isDescriptionNearLimit
                          ? "font-medium text-yellow-600"
                          : ""
                      }
                    >
                      {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
