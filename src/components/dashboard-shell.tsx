import { cn } from "@/lib/utils";

type DashBoardShellProps = React.HTMLAttributes<HTMLDivElement>;

export const DashBoardShell = ({
  children,
  className,
  ...props
}: DashBoardShellProps) => {
  return (
    <div>
      <div className={cn("grid items-center gap-8", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
