import { useFindAllPublicCodes } from "@src/api/code/code";
import { FindAllPublicCodesParams } from "@src/api/models";
import { useGetUserByIdSuspense } from "@src/api/users/users";
import { Empty } from "@src/components/empty";
import { Avatar, AvatarFallback, AvatarImage } from "@src/components/ui/avatar";
import { Badge } from "@src/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@src/components/ui/card";
import { useAuthContext } from "@src/global-context/auth/hook";
import { CodeList } from "@src/pages/code/components/code-list";
import { formatRelativeTime } from "@src/utils/format-relative-time";
import { CalendarIcon, MailIcon } from "lucide-react";
import { useParams } from "react-router";
import { CodeCard } from "../../code/components/code-card";
import { CodeCardSkeleton } from "../../code/components/code-card/skeleton";
import { CreateCodeButton } from "../../code/components/create-code-button";

export function UsersDetails() {
  const { userId } = useParams();
  const { user: loggedUser } = useAuthContext();

  // Buscar dados do usuário utilizando o hook de suspense
  const { data: user } = useGetUserByIdSuspense(userId!);

  // Buscar os códigos públicos do usuário
  const params: FindAllPublicCodesParams = { authorId: userId };
  const { data: userCodes, isLoading: isLoadingCodes } =
    useFindAllPublicCodes(params);

  // Verificar se o usuário logado é o dono do perfil
  const isOwnProfile = loggedUser?.id === userId;

  return (
    <div className="container mx-auto flex flex-col gap-6 p-4">
      {/* Card com informações do usuário */}
      <Card className="mx-auto w-full">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="border-primary h-20 w-20 border-2">
            <AvatarImage
              src={user.avatarUrl ?? undefined}
              alt={user.name || "Usuário"}
            />
            <AvatarFallback className="text-xl">
              {user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1">
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            {user.email && (
              <CardDescription className="flex items-center gap-1">
                <MailIcon className="h-4 w-4" />
                {user.email}
              </CardDescription>
            )}

            {user.createdAt && (
              <CardDescription className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                <CalendarIcon className="h-3 w-3" />
                <span>Membro desde {formatRelativeTime(user.createdAt)}</span>
              </CardDescription>
            )}
          </div>

          {isOwnProfile && <CreateCodeButton className="ml-auto" />}
        </CardHeader>
      </Card>

      {/* Seção de códigos do usuário */}
      <div className="mx-auto w-full">
        <h2 className="mb-4 text-xl font-semibold">
          Códigos públicos de {user.name}
          <Badge variant="outline" className="ml-2">
            {userCodes?.length || 0}
          </Badge>
        </h2>

        {isLoadingCodes ? (
          <CodeList>
            {Array(2)
              .fill(0)
              .map((_, index) => (
                <CodeCardSkeleton key={index} />
              ))}
          </CodeList>
        ) : userCodes && userCodes.length > 0 ? (
          <CodeList>
            {userCodes.map((code) => (
              <CodeCard key={code.id} code={code} />
            ))}
          </CodeList>
        ) : (
          <Empty message="Este usuário ainda não compartilhou nenhum código público." />
        )}
      </div>
    </div>
  );
}
