import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero section */}
      <section className="mb-16 text-center">
        <h1 className="mb-6 text-4xl font-bold md:text-5xl">About My Blog</h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
          A personal journey through web development and technology
        </p>
      </section>

      {/* About content */}
      <section className="mb-16">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="mb-4 text-3xl font-bold">Our Story</h2>
            <p className="mb-4 text-muted-foreground">
              Welcome to my blog! I started this platform in 2025 as a way to
              share my experiences and knowledge in web development,
              particularly focusing on modern JavaScript frameworks and best
              practices.
            </p>
            <p className="mb-4 text-muted-foreground">
              With over 5 years of experience in the field, I've worked with
              various technologies including React, Next.js, Node.js, and more.
              This blog is my way of giving back to the community and helping
              other developers on their journey.
            </p>
            <p className="text-muted-foreground">
              Whether you're a beginner just starting out or an experienced
              developer looking to stay updated with the latest trends, I hope
              you find value in the content I share here.
            </p>
          </div>
          <div className="relative h-80 overflow-hidden rounded-lg">
            <Image
              src="/images/placeholder-cover.jpg"
              alt="Blog author"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Mission section */}
      <section className="mb-16 rounded-xl bg-muted p-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold">Our Mission</h2>
          <p className="mb-6 text-xl">
            To provide high-quality, accessible content that helps developers
            grow their skills and build better web applications.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-bold">Educate</h3>
              <p>
                Share in-depth tutorials and guides on modern web technologies
              </p>
            </div>
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-bold">Inspire</h3>
              <p>Showcase innovative projects and ideas to spark creativity</p>
            </div>
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-bold">Connect</h3>
              <p>
                Build a community of like-minded developers to share knowledge
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="text-center">
        <h2 className="mb-6 text-3xl font-bold">Get in Touch</h2>
        <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
          Have questions or suggestions? I'd love to hear from you!
        </p>
        <Button asChild size="lg">
          <Link href="/contact">Contact Me</Link>
        </Button>
      </section>
    </div>
  );
}
