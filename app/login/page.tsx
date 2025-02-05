import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button, ButtonGroup } from "@heroui/button";
import { button as buttonStyles } from "@heroui/theme";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

import { Meteors } from "@/components/ui/meteors";
import { BorderBeam } from "@/components/ui/border-beam";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { Link } from "@heroui/link";
import { title, subtitle } from "@/components/primitives";

import { Image } from "@heroui/image";
import { siteConfig } from "@/config/site";
import { GoogleIcon } from "@/components/icons";

export default async function Page() {
  return (
    <>
      {/* <Image
        alt="Card background"
        className="object-cover"
        src="/LOGOTIPO_PRINCIPAL.png"
        width={300}
      /> */}
      <Card
        className="relative py-12  pb-8 px-4  mt-16
       flex flex-col max-w-xl text-center justify-center items-center gap-4"
      >
        <Meteors number={5} />
        <BorderBeam
          size={250}
          duration={12}
          delay={9}
          colorFrom="#41db78"
          colorTo="#2a8e4e"
        />
        <div>
          <p className={title()}>Connect English</p>
          <p>
            <span className={title()}> Monitor</span>
            <span className={title({ color: "green" })}> Financiero</span>
          </p>
        </div>
        <div className={subtitle({ class: "m-0 p-0" })}>
          Inica sesión para continuar
        </div>

        <a href="/login/google" className="mt-8">
          <Button
            color="success"
            size="lg"
            className="text-white"
            variant="shadow"
          >
            Acceder con Google
            <GoogleIcon />
          </Button>
        </a>
      </Card>
    </>
  );
}
