import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
  Heart,
  MoreHorizontal,
  MessageCircle,
  Repeat2,
  Send,
} from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen text-foreground">
      {/* Top Navigation */}

      {/* Main Content */}
      <main className="ml-16 pt-16 bg-transparent">
        <div className="mx-auto max-w-2xl px-4 py-6">
          {/* First Post */}
          <Card className="mb-4">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/redemption.png" />
                    <AvatarFallback>CF</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">cleanfoodcrush</span>
                      <span className="text-blue-500">✓</span>
                      <span className="text-muted-foreground">· 22h</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                That movie you&apos;ve watched 3 times, but you still feel like
                watching again & again?
              </p>
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-4 text-muted-foreground">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-foreground"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <span className="text-sm">10</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-foreground"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <span className="text-sm">18</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-foreground"
                >
                  <Repeat2 className="h-5 w-5" />
                </Button>
                <span className="text-sm">1</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-foreground"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Second Post */}
          <Card className="mb-4">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/redemption.png" />
                    <AvatarFallback>KC</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">kaldicoffeefarm</span>
                      <span className="text-blue-500">✓</span>
                      <span className="text-muted-foreground">· 12h</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Image
                src={`${
                  process.env.NEXT_PUBLIC_IMAGE_URL ||
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Y0c79SVqC5GnFgPaN7UEIIAGALW2ES.png"
                }`}
                alt="Japanese food product"
                width={500}
                height={500}
                className="rounded-lg"
              />
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-foreground"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-foreground"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-foreground"
                >
                  <Repeat2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-foreground"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Third Post */}
          <Card className="mb-4">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/redemption.png" />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">m3s.97</span>
                      <span className="text-muted-foreground">· 1d</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-right" dir="rtl">
                يا رب في يوم الجمعة إني دعوتك وكلي يقين بأن الإجابة من عندك،
                اللهم لا توقفني و سعادتي بيديك أستودعتك جل ما في قلبي فيشرحني
                بما يسرني
              </p>
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-foreground"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-foreground"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-foreground"
                >
                  <Repeat2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-foreground"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
