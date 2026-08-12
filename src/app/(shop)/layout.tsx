import { SiteFooter } from "@/shared/components/layout/SiteFooter"
import { SiteHeader } from "@/shared/components/layout/SiteHeader"

export default function ShopLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  )
}
