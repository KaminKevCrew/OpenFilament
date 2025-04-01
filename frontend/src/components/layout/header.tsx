'use client';

import Link from "next/link"
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { auth } from '@/lib/auth';
import { useAuth } from '@/lib/auth-context';

export function Header() {
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleSignOut = () => {
    auth.removeToken();
    setIsAuthenticated(false);
    router.push('/auth/signin');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">OpenFilament</span>
          </Link>
          {isAuthenticated && (
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/materials"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Materials
              </Link>
              <Link
                href="/filaments"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Filaments
              </Link>
              <Link
                href="/spools"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Spools
              </Link>
            </nav>
          )}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {isAuthenticated ? (
            <Button variant="ghost" onClick={handleSignOut}>
              Sign out
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
} 