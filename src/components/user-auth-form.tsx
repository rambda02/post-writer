import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { buttonVariants } from "./ui/button";
import { Icon } from "./icon";

export const UserAuthForm = () => {
  return (
    <div className="grid gap-6">
      <form>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" type="email" placeholder="name@example.com" />
          </div>
          <button className={cn(buttonVariants())}>
            メールアドレスでログイン
          </button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="text-muted-foreground px-2 bg-background">
            または
          </span>
        </div>
      </div>
      <button className={cn(buttonVariants({ variant: "outline" }))}>
        <Icon.github />
        GitHub
      </button>
    </div>
  );
};
