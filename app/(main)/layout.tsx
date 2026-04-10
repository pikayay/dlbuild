'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const links = [
  { href: '/deadlock/items', label: 'Items' },
  { href: '/deadlock/builds', label: 'Builds' },
  { href: '/deadlock/heroes', label: 'Heroes' },
  { href: '/profile', label: 'Profile' },
]

export default function DeadlockLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Deadlock App</h2>
        </div>
        <nav>
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>
                  <motion.div
                    className={`p-4 hover:bg-gray-700 ${
                      pathname === link.href ? 'bg-gray-700' : ''
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.label}
                  </motion.div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
