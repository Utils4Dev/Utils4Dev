import { zodResolver } from "@hookform/resolvers/zod";
import {
  getCommentsByCodeIdQueryKey,
  useAddCommentToCode,
  useCommentsByCodeId,
} from "@src/api/code/code";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loading } from "../loading";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { CommentItem } from "./components/comment-item";

const formSchema = z.object({
  content: z
    .string({
      required_error: "O comentário não pode estar vazio",
    })
    .min(1, "O comentário não pode estar vazio")
    .max(300, "O comentário não pode ter mais de 300 caracteres")
    .transform((value) => value.trim()),
});

type FormValues = z.infer<typeof formSchema>;

type CommentsSectionProps = {
  codeId: string;
};

export function CommentsSection({ codeId }: CommentsSectionProps) {
  const queryClient = useQueryClient();

  const { data: comments, isLoading: isLoadingComments } =
    useCommentsByCodeId(codeId);

  const { mutateAsync: addComment, isPending: isPendingAddComment } =
    useAddCommentToCode({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getCommentsByCodeIdQueryKey(codeId),
          });
        },
        onError: () => {
          toast.error("Erro ao adicionar comentário");
        },
      },
    });

  const disabledForm = isLoadingComments || isPendingAddComment;

  const form = useForm<FormValues>({
    disabled: disabledForm,
    resolver: zodResolver(formSchema),
  });

  async function handleAddComment({ content }: FormValues) {
    await addComment({
      id: codeId,
      data: {
        content,
      },
    });
    form.reset({
      content: "",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comentários</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoadingComments ? (
          <Loading />
        ) : (
          <div className="space-y-4">
            {comments?.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center italic">
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </p>
            ) : (
              comments?.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))
            )}
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddComment)}
            className="mt-6 flex gap-2"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Adicione um comentário"
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={disabledForm} className="h-11">
              {isPendingAddComment ? "Enviando..." : "Enviar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
