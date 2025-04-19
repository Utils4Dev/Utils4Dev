import { useGetBookmarkCodes } from "@src/api/code/code";
import { Empty } from "@src/components/empty";
import { Input } from "@src/components/ui/input";
import { debounce } from "radash";
import { Link, useSearchParams } from "react-router";
import { CodeCard } from "../components/code-card";
import { CodeCardSkeleton } from "../components/code-card/skeleton";
import { CodeList } from "../components/code-list";

const CODE_SKELETON_LENGTH = 6;
const DEBOUNCE_DELAY = 300;

export function BookmarkList() {
  const [params, setParams] = useSearchParams();
  const name = params.get("name") || undefined;

  const { data: codes, isLoading } = useGetBookmarkCodes();

  function handleNameChange(name: string) {
    setParams((prev) => {
      prev.set("name", name);
      return prev;
    });
  }

  return (
    <main className="flex flex-1 flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Procurar"
          defaultValue={name}
          onChange={debounce({ delay: DEBOUNCE_DELAY }, (e) =>
            handleNameChange(e.target.value),
          )}
          className="w-full max-w-92"
        />
      </div>

      <CodeList>
        {isLoading ? (
          <>
            {Array.from({ length: CODE_SKELETON_LENGTH }).map((_, index) => (
              <CodeCardSkeleton key={index} />
            ))}
          </>
        ) : codes?.length ? (
          codes.map((code) => (
            <Link key={code.id} to={`/codes/${code.id}/edit`}>
              <CodeCard code={code} />
            </Link>
          ))
        ) : (
          <Empty
            message="Nenhum código encontrado"
            className="col-span-full row-span-full"
          />
        )}
      </CodeList>
    </main>
  );
}
