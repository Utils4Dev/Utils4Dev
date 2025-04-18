import { zodResolver } from "@hookform/resolvers/zod";
import {
  useDeleteCodeById,
  useFindCodeByIdSuspense,
  useUpdateCodeById,
} from "@src/api/code/code";
import {
  ExtendedCodeDto,
  ExtendedUpdateCodeDto,
} from "@src/api/models/extended-types";
import { CodeEditor } from "@src/components/code-editor";
import { Loading } from "@src/components/loading";
import { Button } from "@src/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import { Switch } from "@src/components/ui/switch";
import { Textarea } from "@src/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const MAX_DESCRIPTION_LENGTH = 250;
const MAX_KEYWORDS_COUNT = 5;

const formSchema = z.object({
  name: z.string().nonempty("Título é obrigatório"),
  private: z.boolean().default(false),
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

export function CodeEditPage() {
  const { codeId } = useParams();
  const navigate = useNavigate();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [keywordsCount, setKeywordsCount] = useState(0);
  const [descriptionLength, setDescriptionLength] = useState(0);

  const queryClient = useQueryClient();
  const {
    data: codeData,
    refetch: findCodeByIdRefetch,
    isRefetching,
  } = useFindCodeByIdSuspense(codeId!);

  // Convertemos CodeDto para ExtendedCodeDto para acessar os campos keywords e description
  const code = codeData as unknown as ExtendedCodeDto;

  const { mutateAsync: updateCode, isPending: isUpdatePending } =
    useUpdateCodeById();
  const { mutateAsync: deleteCode, isPending: isDeletePending } =
    useDeleteCodeById();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: {
      name: code.name,
      private: code.private,
      code: code.content,
      keywords: code.keywords ? code.keywords.join(", ") : "",
      description: code.description || "",
    },
  });
  const isLoading = isUpdatePending || isRefetching || isDeletePending;

  // Monitorar e atualizar contagem de palavras-chave e comprimento da descrição
  useEffect(() => {
    // Inicializa os contadores com os valores iniciais
    const keywordsValue = code.keywords || [];
    setKeywordsCount(keywordsValue.length);
    setDescriptionLength((code.description || "").length);

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
  }, [form.watch, code.keywords, code.description]);

  async function handleSubmit(data: FormValues) {
    try {
      // Converte a string de palavras-chave em um array
      const keywordsArray = data.keywords
        ? data.keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean)
            .slice(0, MAX_KEYWORDS_COUNT)
        : [];

      await updateCode({
        id: codeId!,
        data: {
          name: data.name,
          private: data.private,
          content: data.code,
          keywords: keywordsArray,
          description: data.description?.slice(0, MAX_DESCRIPTION_LENGTH),
        } as ExtendedUpdateCodeDto,
      });
      await findCodeByIdRefetch();
      await queryClient.invalidateQueries({
        queryKey: ["/codes"],
      });
      toast.success("Código atualizado com sucesso");
      navigate(`/codes/${codeId}`);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar o código");
    }
  }

  // Cálculos para os indicadores visuais
  const isKeywordsLimitReached = keywordsCount >= MAX_KEYWORDS_COUNT;
  const isDescriptionNearLimit =
    descriptionLength > MAX_DESCRIPTION_LENGTH * 0.9;

  async function handleDelete() {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }

    try {
      await deleteCode({ id: codeId! });
      await queryClient.invalidateQueries({
        queryKey: ["/codes"],
      });
      toast.success("Código excluído com sucesso");
      navigate("/codes/me");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir o código");
    } finally {
      setIsConfirmingDelete(false);
    }
  }

  return (
    <main className="flex flex-1">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-1 flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            {/* Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Privado */}
            <FormField
              control={form.control}
              name="private"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Privado</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!form.formState.isDirty || isLoading}
              className="w-[132px] self-end"
            >
              Publicar
              {isLoading && <Loading />}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="w-[132px] self-end"
            >
              {isConfirmingDelete ? "Confirmar" : "Excluir"}
              {isDeletePending && <Loading />}
            </Button>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-4">
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
          </div>

          {/* Código */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <CodeEditor
                    language={code.language}
                    value={field.value}
                    onChange={field.onChange}
                    options={{ automaticLayout: true }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </main>
  );
}
