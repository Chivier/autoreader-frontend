'use client';

import { useUser } from '@clerk/nextjs';
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import styles from './header.module.css'; // Import the CSS module

export function Header() {
  const { user } = useUser();

  return (
    <header className={styles.header}>
      <div>
        <Link href="/">
          <h1 className={styles.logo}>AutoReader</h1>
        </Link>
      </div>
      <div>
        <Link href="/">
          <h2 className={styles.link}>Search</h2>
        </Link>
      </div>
      <div>
        <Link href="/subscription">
          <h2 className={styles.link}>Subscription</h2>
        </Link>
      </div>
      <div>
        <Link href="/about">
          <h2 className={styles.link}>About</h2>
        </Link>
      </div>
      <div>
        {user ? (
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "size-6",
              },
            }}
          />
        ) : (
          <Link href="/sign-in" 
          className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold">
            SignIn
          </Link>
        )}
      </div>
    </header>
  );
}
