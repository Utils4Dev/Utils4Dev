import { zodResolver } from "@hookform/resolvers/zod";
import {
  useDeleteCodeById,
  useFindCodeByIdSuspense,
  useUpdateCode,
} from "@src/api/code/code";
import { CodeEditor } from "@src/components/code-editor";
import { Loading } from "@src/components/loading";
import { Button } from "@src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import { Switch } from "@src/components/ui/switch";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().nonempty("Título é obrigatório"),
  private: z.boolean().default(false),
  code: z.string().nonempty("Código é obrigatório"),
});

type FormValues = z.infer<typeof formSchema>;

export function CodeEditPage() {
  const { codeId } = useParams();
  const navigate = useNavigate();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const queryClient = useQueryClient();
  const {
    data: code,
    refetch: findCodeByIdRefetch,
    isRefetching,
  } = useFindCodeByIdSuspense(codeId!);
  const { mutateAsync: updateCode, isPending: isUpdatePending } =
    useUpdateCode();
  const { mutateAsync: deleteCode, isPending: isDeletePending } =
    useDeleteCodeById();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: {
      name: code.name,
      private: code.private,
      code: code.content,
    },
  });
  const isLoading = isUpdatePending || isRefetching || isDeletePending;

  async function handleSubmit(data: FormValues) {
    try {
      await updateCode({
        id: codeId!,
        data: {
          name: data.name,
          private: data.private,
          content: data.code,
        },
      });
      await findCodeByIdRefetch();
      toast.success("Código atualizado com sucesso");
      navigate(`/codes/${codeId}`);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar o código");
    }
  }

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
