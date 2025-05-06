import { Post } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Icon } from "./icon";
import Link from "next/link";

interface PostOperationsProps {
  post: Pick<Post, "id" | "title">;
}

export const PostOperations = ({ post }: PostOperationsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Icon.ellipsis className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href={`/editor/${post.id}`} className="w-full">
            編集
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive cursor-pointer focus:text-destructive">
          削除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
